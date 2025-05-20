import { useAuthenticationQuery } from '@/quries/use-authentication-query'
import type { FC, ReactNode } from 'react'

type SignedInProps = {
  children: ReactNode
}

export const SignedIn: FC<SignedInProps> = ({ children }) => {
  const {
    authenticationQuery: { isLoading, data },
  } = useAuthenticationQuery()

  if (isLoading || !data) {
    return null
  }

  return children
}
