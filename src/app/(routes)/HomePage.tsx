import { SignedInRoute } from '@/components/common/SignedInRoute'
import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@radix-ui/react-dialog'
import { type FC } from 'react'
import { TodoFormDialog } from './TodoFormDialog'
import { TodoList } from './TodoList'

export const HomePage: FC = () => {
  return (
    <SignedInRoute>
      <div className='container m-2 mx-auto min-h-[calc(100vh-210px)] max-w-6xl p-2'>
        <div className='mx-auto my-4 flex flex-col md:w-1/4'>
          <TodoFormDialog>
            <DialogTrigger asChild>
              <Button className='cursor-pointer'>작업 추가</Button>
            </DialogTrigger>
          </TodoFormDialog>
        </div>
        <TodoList />
      </div>
    </SignedInRoute>
  )
}
