import { useAuthenticationQuery } from '@/hooks/use-authentication-query'
import type { FC, ReactNode } from 'react'

type SignedOutProps = {
  children: ReactNode
}

export const SignedOut: FC<SignedOutProps> = ({ children }) => {
  const {
    authenticationQuery: { isLoading, data },
  } = useAuthenticationQuery()

  if (isLoading || data) {
    return null
  }

  return children
}
