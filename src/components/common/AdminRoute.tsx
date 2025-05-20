import { useAuthenticationQuery } from '@/quries/use-authentication-query'
import type { FC, ReactNode } from 'react'
import { Navigate } from 'react-router'

export const AdminRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const {
    authenticationQuery: { isLoading, data },
  } = useAuthenticationQuery()

  if (isLoading) {
    return
  }

  if (!data) {
    return <Navigate to='/sign-in' />
  }

  if (data.role !== 'ROLE_ADMIN') {
    return <Navigate to='/sign-in' />
  }

  return children
}
