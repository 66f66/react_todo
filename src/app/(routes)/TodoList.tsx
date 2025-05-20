import { Skeleton } from '@/components/ui/skeleton'
import { useTodosQuery } from '@/hooks/use-todos-query'
import { Page, Todo } from '@/lib/types.lib'
import { updateTodoOrders } from '@/service/todo.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useCallback, useEffect } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Masonry from 'react-masonry-css'
import { useLocation, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { TodoItem } from './TodoItem'

export const TodoList: FC = () => {
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const queryClient = useQueryClient()

  const {
    todosQuery: { isLoading, data, refetch },
  } = useTodosQuery()

  useEffect(() => {
    refetch()
  }, [location, refetch])

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

  const mutation = useMutation({
    mutationFn: updateTodoOrders,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['todos'] })

      const oldData = queryClient.getQueryData<Page<Todo>>(['todos'])

      if (oldData) {
        const newData = {
          ...oldData,
          content: [...oldData.content],
        }

        queryClient.setQueryData(['todos'], newData)
      }

      return { oldData }
    },

    onSuccess: () => {
      toast('정렬을 저장했습니다')
    },

    onError: (_error, _variables, context) => {
      if (context?.oldData) {
        queryClient.setQueryData(['todos'], context.oldData)
      }
    },
  })

  const handleDrop = async () => {
    if (data) {
      mutation.mutate(
        data?.content.map((todo, index) => ({
          id: todo.id,
          orderNumber: data ? data.totalElements - 1 - index : 0,
        })),
      )
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

  if (data.content.length === 0) {
    return (
      <div className='container m-2 mx-auto flex min-h-[calc(100vh-210px)] max-w-6xl items-center justify-center gap-2 p-2'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-lg'>
            {searchParams.get('search')
              ? '검색 결과가 없습니다.'
              : '아직 작업이 없습니다. 작업을 추가해보세요.'}
          </span>
        </div>
      </div>
    )
  }

  return (
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
            moveTodo={moveTodo}
            onDrop={handleDrop}
          />
        ))}
      </Masonry>
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
