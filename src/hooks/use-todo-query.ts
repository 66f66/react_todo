import { fetchTodos } from '@/service/todo.service'
import { useQuery } from '@tanstack/react-query'

export const useTodoQuery = () => {
  const todosQuery = useQuery({
    queryKey: ['todos'],
    queryFn: fetchTodos,
    retry: 2,
    staleTime: Infinity,
  })

  return {
    todosQuery,
  }
}
