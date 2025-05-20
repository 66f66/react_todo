import { SignedInRoute } from '@/components/common/SignedInRoute'
import { type FC } from 'react'
import { SearchTodoList } from './SearchTodoList'

export const SearchPage: FC = () => {
  return (
    <SignedInRoute>
      <div className='container m-2 mx-auto min-h-[calc(100vh-210px)] max-w-6xl p-2'>
        <SearchTodoList />
      </div>
    </SignedInRoute>
  )
}
