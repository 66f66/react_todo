import { getTodos } from '@/service/todo.service'
import { isAuthenticated } from '@/service/user.service'
import { useQuery } from '@tanstack/react-query'

export const useTodosQuery = () => {
  const todosQuery = useQuery({
    enabled: isAuthenticated,
    queryKey: ['todos'],
    queryFn: getTodos,
    retry: 2,
    staleTime: Infinity,
  })

  return {
    todosQuery,
  }
}
