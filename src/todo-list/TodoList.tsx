import { Skeleton } from '@/components/ui/skeleton'
import { useTodoQuery } from '@/hooks/use-todo-query'
import { Page, Todo } from '@/lib/types'
import { updateTodoOrderNumber } from '@/service/todo.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, type FC } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Masonry from 'react-masonry-css'
import { useLocation, useSearchParams } from 'react-router'
import { CreateTodo } from './CreateTodo'
import { TodoItem } from './TodoItem'

export const TodoList: FC = () => {
  const [searchParams] = useSearchParams()

  const {
    todosQuery: { isLoading, data, refetch },
  } = useTodoQuery()

  const location = useLocation()

  useEffect(() => {
    refetch()
  }, [location, refetch])

  const queryClient = useQueryClient()
  const moveTodo = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      queryClient.setQueryData<Page<Todo>>(['todos'], (oldData) => {
        if (!oldData) return oldData

        const newContent = [...oldData.content]
        const [removed] = newContent.splice(dragIndex, 1)
        newContent.splice(hoverIndex, 0, removed)

        return {
          ...oldData,
          content: newContent,
        }
      })
    },
    [queryClient],
  )

  const updateOrderMutation = useMutation({
    mutationFn: updateTodoOrderNumber,
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
    onError: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
      refetch()
    },
  })

  const handleDrop = async (todoId: number, newOrderNumber: number) => {
    updateOrderMutation.mutate({ todoId, newOrderNumber })
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

  if (data.content.length === 0) {
    return (
      <div className='container m-2 mx-auto flex min-h-[calc(100vh-210px)] max-w-6xl items-center justify-center gap-2 p-2'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-lg'>
            {searchParams.get('search')
              ? '검색 결과가 없습니다.'
              : '아직 작업이 없습니다. 작업을 추가해보세요.'}
          </span>
          <CreateTodo />
        </div>
      </div>
    )
  }

  return (
    <div className='container m-2 mx-auto min-h-[calc(100vh-210px)] max-w-6xl p-2'>
      <div className='mx-auto my-4 flex flex-col md:w-1/4'>
        <CreateTodo />
      </div>
      <DndProvider backend={HTML5Backend}>
        <Masonry
          breakpointCols={{
            default: 3,
            860: 2,
            500: 1,
          }}
          className='-ml-4 flex'
          columnClassName='pl-4'
        >
          {data.content.map((todo, index) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              index={index}
              totalElements={data.totalElements}
              moveTodo={moveTodo}
              onDrop={handleDrop}
            />
          ))}
        </Masonry>
      </DndProvider>
    </div>
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
