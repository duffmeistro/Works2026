import type { ReactNode } from 'react'
import s from './Device.module.css'

type DeviceProps = {
  size?: 'sm' | 'md' | 'lg'
  island?: boolean
  children: ReactNode
}

export function Device({ size = 'sm', island = false, children }: DeviceProps) {
  return (
    <div className={`${s.device} ${s[size]}`}>
      <div className={s.screen}>
        {children}
        {island && <span className={s.island} aria-hidden="true" />}
      </div>
    </div>
  )
}
