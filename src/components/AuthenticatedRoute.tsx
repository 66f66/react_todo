import { useSessionQuery } from '@/hooks/use-session-query'
import { FC, ReactNode } from 'react'
import { Navigate } from 'react-router'

export const AuthenticatedRoute: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { sessionQuery } = useSessionQuery()

  if (sessionQuery.isLoading) {
    return
  }

  if (sessionQuery.data) {
    return children
  }

  return <Navigate to='/sign-in' />
}
