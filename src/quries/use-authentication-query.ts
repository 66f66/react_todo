import { getAuthentication, isAuthenticated } from '@/service/user.service'
import { useQuery } from '@tanstack/react-query'

export const AuthenticationQueryKey = ['authentication']

export type AuthenticationQueryData = ReturnType<
  typeof useAuthenticationQuery
>['authenticationQuery']['data']

export const useAuthenticationQuery = () => {
  const authenticationQuery = useQuery({
    enabled: isAuthenticated,
    queryKey: AuthenticationQueryKey,
    queryFn: getAuthentication,
    staleTime: 1000 * 60 * 30, // 30분
    retry: 1,
  })

  return {
    authenticationQuery,
  }
}
