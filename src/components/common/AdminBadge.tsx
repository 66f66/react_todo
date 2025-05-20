import { useAuthenticationQuery } from '@/hooks/use-authentication-query'
import type { FC } from 'react'
import { Badge } from '../ui/badge'

type AdminBadgeProps = React.ComponentProps<'span'>

export const AdminBadge: FC<AdminBadgeProps> = ({ className, ...props }) => {
  const {
    authenticationQuery: { data, isLoading },
  } = useAuthenticationQuery()

  if (isLoading || !data) {
    return null
  }

  if (data.role !== 'ROLE_ADMIN') {
    return null
  }

  return (
    <Badge
      className={className}
      {...props}
    >
      관리자
    </Badge>
  )
}
