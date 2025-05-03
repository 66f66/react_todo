import { fetchSession, isAuthenticated } from '@/service/user.service'
import { useQuery } from '@tanstack/react-query'

export const useSessionQuery = () => {
  const sessionQuery = useQuery({
    enabled: isAuthenticated,
    queryKey: ['users', 'me'],
    queryFn: fetchSession,
    staleTime: 1000 * 60 * 30, // 30분
    retry: 1,
  })

  return {
    sessionQuery,
  }
}
