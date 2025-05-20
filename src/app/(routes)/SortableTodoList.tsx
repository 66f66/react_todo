import { Skeleton } from '@/components/ui/skeleton'
import { Todo } from '@/lib/types.lib'
import {
  TodosQueryData,
  TodosQueryKey,
  useTodosQuery,
} from '@/quries/use-todos-query'
import { updateTodoOrders } from '@/service/todo.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { FC, useCallback, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'
import { useLocation } from 'react-router'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'
import { SortableTodoItem } from './SortableTodoItem'

export const SortableTodoList: FC = () => {
  const location = useLocation()
  const queryClient = useQueryClient()

  const {
    todosQuery: { isLoading, data, refetch, fetchNextPage, hasNextPage },
  } = useTodosQuery()

  useEffect(() => {
    refetch()
  }, [location, refetch])

  const moveTodo = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      queryClient.setQueryData<TodosQueryData>(TodosQueryKey, (oldData) => {
        if (!oldData) return oldData

        const allTodos = oldData.pages.flatMap((page) => page.content)

        const newTodos = [...allTodos]
        const [removed] = newTodos.splice(dragIndex, 1)
        newTodos.splice(hoverIndex, 0, removed)

        let remainingTodos = [...newTodos]
        const newPages = oldData.pages.map((page) => {
          const pageSize = page.content.length
          const pageTodos = remainingTodos.slice(0, pageSize)
          remainingTodos = remainingTodos.slice(pageSize)

          return {
            ...page,
            content: pageTodos,
          }
        })

        return {
          ...oldData,
          pages: newPages,
        }
      })
    },
    [queryClient],
  )

  const mutation = useMutation({
    mutationFn: updateTodoOrders,

    mutationKey: [TodosQueryKey, 'save-orders'],

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: [TodosQueryKey] })

      const oldData = queryClient.getQueryData<TodosQueryData>([TodosQueryKey])

      if (oldData) {
        const newData = {
          ...oldData,
          pages: [...oldData.pages],
        }

        queryClient.setQueryData<TodosQueryData>(TodosQueryKey, newData)
      }

      return { oldData }
    },

    onSuccess: () => {
      toast('정렬을 저장했습니다')
    },

    onError: (_error, _variables, context) => {
      if (context?.oldData) {
        queryClient.setQueryData(TodosQueryKey, context.oldData)
      }
    },
  })

  const debouncedHandleDrop = useDebouncedCallback((todos: Todo[]) => {
    const allTodos =
      queryClient
        .getQueryData<TodosQueryData>([TodosQueryKey])
        ?.pages.flatMap((page) => page.content) || []

    mutation.mutate(
      todos.map((todo, index) => ({
        id: todo.id,
        orderNumber: allTodos.length - 1 - index,
      })),
    )
  }, 2000)

  const handleDrop = () => {
    if (data) {
      debouncedHandleDrop(data.pages.flatMap((page) => page.content))
    }
  }

  if (isLoading) {
    return (
      <div className='container m-2 mx-auto min-h-[calc(100vh-210px)] max-w-6xl p-2'>
        <Masonry
          breakpointCols={{
            default: 3,
            860: 2,
            500: 1,
          }}
          className='-ml-4 flex'
          columnClassName='pl-4'
        >
          {[1, 2, 3].map((i) => (
            <TodoListSkeleton key={i} />
          ))}
        </Masonry>
      </div>
    )
  }

  if (!data) {
    return (
      <div className='container m-2 mx-auto flex min-h-[calc(100vh-210px)] max-w-6xl items-center justify-center gap-2 p-2'>
        <span className='text-muted-foreground text-lg'>
          데이터를 가져오지 못했습니다.
        </span>
      </div>
    )
  }

  if (data.pages[0].content.length === 0) {
    return (
      <div className='container m-2 mx-auto flex min-h-[calc(100vh-210px)] max-w-6xl items-center justify-center gap-2 p-2'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-lg'>
            아직 작업이 없습니다. 작업을 추가해보세요
          </span>
        </div>
      </div>
    )
  }

  const allTodos = data?.pages.flatMap((page) => page.content) || []

  return (
    <DndProvider backend={HTML5Backend}>
      <InfiniteScroll
        dataLength={data.pages[0].totalElements}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={
          <div className='flex items-center justify-center py-4 text-center'>
            <Loader className='animate-spin' />
          </div>
        }
        endMessage={
          <p className='py-4 text-center text-gray-500'>
            모든 작업을 불러왔습니다
          </p>
        }
      >
        <Masonry
          breakpointCols={{
            default: 3,
            860: 2,
            500: 1,
          }}
          className='-ml-4 flex'
          columnClassName='pl-4'
        >
          {allTodos.map((todo, index) => (
            <SortableTodoItem
              key={todo.id}
              todo={todo}
              index={index}
              moveTodo={moveTodo}
              onDrop={handleDrop}
            />
          ))}
        </Masonry>
      </InfiniteScroll>
    </DndProvider>
  )
}

const TodoListSkeleton: FC = () => {
  return (
    <div className='mb-4 flex flex-col space-y-3'>
      <Skeleton className='h-[125px] w-[250px] rounded-xl' />
      <div className='space-y-2'>
        <Skeleton className='h-4 w-[250px]' />
        <Skeleton className='h-4 w-[200px]' />
      </div>
    </div>
  )
}
