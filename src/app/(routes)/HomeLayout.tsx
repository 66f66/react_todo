import { Navbar } from '@/app/(routes)/Navbar'
import { Outlet } from 'react-router'

export const HomeLayout = () => {
  return (
    <>
      <Navbar />
      <main className='mt-[70px]'>
        <Outlet />
      </main>
    </>
  )
}
