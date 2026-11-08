import { PanelOpenContext } from './Media'
import { Part1Hero } from '../case-study/Part1Hero'
import { Part2Beginnings } from '../case-study/Part2Beginnings'
import { Part3System } from '../case-study/Part3System'
import { Part4Iterative } from '../case-study/Part4Iterative'
import { Part5Next } from '../case-study/Part5Next'
import { Part6Voice } from '../case-study/Part6Voice'
import { Part7Friction } from '../case-study/Part7Friction'
import { Part8Growth } from '../case-study/Part8Growth'
import { Part9Impact } from '../case-study/Part9Impact'
import '../case-study/case-study.css'

type StudyContentProps = {
  open: boolean
  onClose: () => void
}

export function StudyContent({ open, onClose }: StudyContentProps) {
  return (
    <PanelOpenContext.Provider value={open}>
      <div className="cs-root">
        <Part1Hero />
        <Part2Beginnings />
        <Part3System />
        <Part4Iterative />
        <Part5Next />
        <Part6Voice />
        <Part7Friction />
        <Part8Growth />
        <Part9Impact />
        <div className="hm-next cs-end">
          <span>Back to all projects</span>
          <button type="button" className="hm-nextbtn" onClick={onClose}>
            All projects
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M2 9 H16 M10 3 L16 9 L10 15" />
            </svg>
          </button>
        </div>
      </div>
    </PanelOpenContext.Provider>
  )
}
