import { useAuthenticationQuery } from '@/quries/use-authentication-query'
import type { FC, ReactNode } from 'react'
import { Navigate } from 'react-router'

export const SignedInRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    authenticationQuery: { isLoading, data },
  } = useAuthenticationQuery()

  if (isLoading) {
    return
  }

  if (!data) {
    return <Navigate to='/auth/sign-in' />
  }

  return children
}
