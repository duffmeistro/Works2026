/* Tiny standalone runtime for the reverie screens (.dc.html format).
   Reads the <x-dc> template and the text/x-dc component script on the page,
   renders it, and re-renders (with DOM patching) on setState / forceUpdate. */
(function () {
  'use strict';

  class DCLogic {
    constructor(props) {
      this.props = props || {};
      this.state = {};
      this.__dc = null;
    }
    setState(patch, cb) {
      const p = typeof patch === 'function' ? patch(this.state, this.props) : patch;
      this.state = Object.assign({}, this.state, p);
      if (this.__dc) this.__dc.schedule(cb);
    }
    forceUpdate(cb) {
      if (this.__dc) this.__dc.schedule(cb);
    }
  }
  window.DCLogic = DCLogic;

  const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  const WHOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null' || path === 'undefined') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    let v = scope;
    const parts = path.split('.');
    for (let i = 0; i < parts.length; i++) {
      if (v == null) return undefined;
      v = v[parts[i]];
    }
    return v;
  }

  const str = (v) => (v == null || v === false ? '' : String(v));

  function build(node, scope) {
    if (node.nodeType === 3) {
      return [document.createTextNode(node.nodeValue.replace(HOLE, (m, p) => str(lookup(p, scope))))];
    }
    if (node.nodeType !== 1) return [];
    const tag = node.localName;
    if (tag === 'helmet') return [];
    if (tag === 'sc-for') {
      const m = WHOLE.exec(node.getAttribute('list') || '');
      const list = (m && lookup(m[1], scope)) || [];
      const as = node.getAttribute('as') || 'item';
      const out = [];
      Array.prototype.forEach.call(list, (item, i) => {
        const sc = Object.create(scope);
        sc[as] = item;
        sc.$index = i;
        node.childNodes.forEach((c) => build(c, sc).forEach((n) => out.push(n)));
      });
      return out;
    }
    if (tag === 'sc-if') {
      const raw = node.getAttribute('value') || '';
      const m = WHOLE.exec(raw);
      const v = m ? lookup(m[1], scope) : raw;
      const out = [];
      if (v && v !== 'false') node.childNodes.forEach((c) => build(c, scope).forEach((n) => out.push(n)));
      return out;
    }

    const el = document.createElementNS(node.namespaceURI, node.localName);
    const handlers = {};
    Array.prototype.forEach.call(node.attributes, (a) => {
      const name = a.name;
      if (name.indexOf('hint-') === 0) return;
      const m = WHOLE.exec(a.value);
      if (name.length > 2 && name.indexOf('on') === 0) {
        const fn = m ? lookup(m[1], scope) : null;
        if (typeof fn === 'function') handlers[name.slice(2)] = fn;
        return;
      }
      let v = m ? lookup(m[1], scope) : a.value.replace(HOLE, (mm, p) => str(lookup(p, scope)));
      if (typeof v === 'function') return;
      if (name === 'value' && (tag === 'textarea' || tag === 'input')) {
        el.value = str(v);
        el.__val = true;
        return;
      }
      if (m && (v === false || v == null)) {
        if (/^(aria-|data-)/.test(name)) el.setAttribute(name, String(v));
        return;
      }
      if (m && v === true) v = /^(aria-|data-)/.test(name) ? 'true' : '';
      let href = String(v);
      if (name === 'href') href = href.replace(/([\w-]+)\.dc\.html/, '$1.html');
      el.setAttribute(name, href);
    });
    el.__h = handlers;
    bindHandlers(el);
    node.childNodes.forEach((c) => build(c, scope).forEach((n) => el.appendChild(n)));
    return [el];
  }

  function bindHandlers(el) {
    el.__l = el.__l || {};
    const isField = /^(input|textarea|select)$/.test(el.localName);
    Object.keys(el.__h).forEach((type) => {
      const types = type === 'change' && isField ? ['change', 'input'] : [type];
      types.forEach((t) => {
        if (el.__l[t]) return;
        el.__l[t] = true;
        el.addEventListener(t, (ev) => {
          const h = el.__h[type];
          if (h) h(ev);
        });
      });
    });
  }

  function sameKind(a, b) {
    if (a.nodeType !== b.nodeType) return false;
    if (a.nodeType === 3) return true;
    return a.localName === b.localName && a.namespaceURI === b.namespaceURI;
  }

  function morphEl(oldEl, newEl) {
    // attributes
    Array.prototype.slice.call(oldEl.attributes).forEach((a) => {
      if (!newEl.hasAttribute(a.name)) oldEl.removeAttribute(a.name);
    });
    Array.prototype.forEach.call(newEl.attributes, (a) => {
      if (oldEl.getAttribute(a.name) !== a.value) oldEl.setAttribute(a.name, a.value);
    });
    oldEl.__h = newEl.__h;
    bindHandlers(oldEl);
    if (newEl.__val && oldEl.value !== newEl.value) oldEl.value = newEl.value;
    morphChildren(oldEl, newEl);
  }

  function morphChildren(oldParent, newParent) {
    const olds = Array.prototype.slice.call(oldParent.childNodes);
    const news = Array.prototype.slice.call(newParent.childNodes);
    const n = Math.max(olds.length, news.length);
    for (let i = 0; i < n; i++) {
      const o = olds[i];
      const w = news[i];
      if (!w) { oldParent.removeChild(o); continue; }
      if (!o) { oldParent.appendChild(w); continue; }
      if (!sameKind(o, w)) { oldParent.replaceChild(w, o); continue; }
      if (o.nodeType === 3) { if (o.nodeValue !== w.nodeValue) o.nodeValue = w.nodeValue; continue; }
      morphEl(o, w);
    }
  }

  function boot() {
    const xdc = document.querySelector('x-dc');
    const scriptEl = document.querySelector('script[type="text/x-dc"]');
    if (!xdc || !scriptEl) return;

    // styles / links declared in <helmet> go to <head>
    const helmet = xdc.querySelector('helmet');
    if (helmet) Array.prototype.slice.call(helmet.children).forEach((c) => document.head.appendChild(c));

    const tpl = document.createDocumentFragment();
    while (xdc.firstChild) tpl.appendChild(xdc.firstChild);
    xdc.style.display = 'contents';

    const props = {};
    try {
      const def = JSON.parse(scriptEl.getAttribute('data-props') || '{}');
      Object.keys(def).forEach((k) => {
        const d = def[k];
        if (d && typeof d === 'object' && 'default' in d) props[k] = d.default;
      });
    } catch (e) { /* no props */ }

    const Component = new Function('DCLogic', scriptEl.textContent + '\nreturn Component;')(DCLogic);
    const inst = new Component(props);

    const renderNodes = () => {
      const vals = inst.renderVals ? inst.renderVals() : {};
      const scope = Object.create(vals);
      const out = [];
      tpl.childNodes.forEach((c) => build(c, scope).forEach((n) => out.push(n)));
      return out;
    };

    let pending = false;
    const cbs = [];
    inst.__dc = {
      schedule(cb) {
        if (cb) cbs.push(cb);
        if (pending) return;
        pending = true;
        Promise.resolve().then(() => {
          pending = false;
          const holder = document.createElement('div');
          renderNodes().forEach((n) => holder.appendChild(n));
          morphChildren(xdc, holder);
          cbs.splice(0).forEach((f) => f());
        });
      }
    };

    renderNodes().forEach((n) => xdc.appendChild(n));
    if (inst.componentDidMount) inst.componentDidMount();
    window.addEventListener('pagehide', () => { if (inst.componentWillUnmount) inst.componentWillUnmount(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
