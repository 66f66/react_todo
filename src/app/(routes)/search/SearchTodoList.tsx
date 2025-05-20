import { TodoItem } from '@/components/TodoItem'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodosQuery } from '@/quries/use-todos-query'
import { Loader } from 'lucide-react'
import { FC, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import Masonry from 'react-masonry-css'
import { useLocation } from 'react-router'

export const SearchTodoList: FC = () => {
  const location = useLocation()

  const {
    todosQuery: { isLoading, data, refetch, fetchNextPage, hasNextPage },
  } = useTodosQuery()

  useEffect(() => {
    refetch()
  }, [location, refetch])

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
          데이터를 가져오지 못했습니다
        </span>
      </div>
    )
  }

  if (data.pages[0].content.length === 0) {
    return (
      <div className='container m-2 mx-auto flex min-h-[calc(100vh-210px)] max-w-6xl items-center justify-center gap-2 p-2'>
        <div className='flex flex-col gap-2'>
          <span className='text-muted-foreground text-lg'>
            검색 결과가 없습니다
          </span>
        </div>
      </div>
    )
  }

  const allTodos = data?.pages.flatMap((page) => page.content) || []

  return (
    <InfiniteScroll
      style={{ minHeight: '100vh' }}
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
        {allTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
          />
        ))}
      </Masonry>
    </InfiniteScroll>
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
