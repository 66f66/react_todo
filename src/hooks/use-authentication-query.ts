import { getAuthentication, isAuthenticated } from '@/service/user.service'
import { useQuery } from '@tanstack/react-query'

export const useAuthenticationQuery = () => {
  const authenticationQuery = useQuery({
    enabled: isAuthenticated,
    queryKey: ['authentication'],
    queryFn: getAuthentication,
    staleTime: 1000 * 60 * 30, // 30분
    retry: 1,
  })

  return {
    authenticationQuery,
  }
}
