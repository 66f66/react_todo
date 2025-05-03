import { fetchTodos } from '@/service/todo.service'
import { isAuthenticated } from '@/service/user.service'
import { useQuery } from '@tanstack/react-query'

export const useTodoQuery = () => {
  const todosQuery = useQuery({
    enabled: isAuthenticated,
    queryKey: ['todos'],
    queryFn: fetchTodos,
    retry: 2,
    staleTime: Infinity,
  })

  return {
    todosQuery,
  }
}
