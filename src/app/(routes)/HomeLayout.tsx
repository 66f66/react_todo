import { Navbar } from '@/app/(routes)/Navbar'
import { useAuthenticationQuery } from '@/quries/use-authentication-query'
import { Outlet } from 'react-router'

export const HomeLayout = () => {
  const { authenticationQuery } = useAuthenticationQuery()

  if (authenticationQuery.isLoading) {
    return null
  }

  return (
    <>
      <Navbar />
      <main className='mt-[70px]'>
        <Outlet />
      </main>
    </>
  )
}
