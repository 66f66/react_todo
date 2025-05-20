import type { FC } from 'react'
import { Outlet } from 'react-router'

export const AuthLayout: FC = () => {
  return (
    <div className='flex min-h-screen items-center justify-center'>
      <Outlet />
    </div>
  )
}
