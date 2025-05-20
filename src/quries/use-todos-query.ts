import { getTodos } from '@/service/todo.service'
import { isAuthenticated } from '@/service/user.service'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router'

export const TodosQueryKey = ['todos']

export type TodosQueryData = ReturnType<
  typeof useTodosQuery
>['todosQuery']['data']

export const useTodosQuery = () => {
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  const todosQuery = useInfiniteQuery({
    enabled: isAuthenticated,
    queryKey: TodosQueryKey,
    queryFn: ({ pageParam = 0 }) => getTodos({ pageParam, q: searchQuery }),
    retry: 2,
    staleTime: Infinity,
    getNextPageParam: (lastPage) => {
      return lastPage.last ? undefined : lastPage.number + 1
    },
    initialPageParam: 0,
  })

  return {
    todosQuery,
  }
}
