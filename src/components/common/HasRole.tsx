import { useAuthenticationQuery } from '@/hooks/use-authentication-query'
import type { Role } from '@/lib/types.lib'
import type { FC, ReactNode } from 'react'

type HasRoleProps = {
  children: ReactNode
  roles: Role[]
}

export const HasRole: FC<HasRoleProps> = ({ children, roles }) => {
  const {
    authenticationQuery: { isLoading, data },
  } = useAuthenticationQuery()

  if (isLoading || !data) {
    return null
  }

  if (!roles.some((role) => data.role === role)) {
    return null
  }

  return children
}
