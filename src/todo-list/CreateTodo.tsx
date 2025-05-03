import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { useState } from 'react'
import { TodoForm } from './TodoForm'

export const CreateTodo = () => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className='hover:cursor-pointer'
        >
          새 작업
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 작업</DialogTitle>
          <DialogDescription>새 작업을 추가해보세요.</DialogDescription>
        </DialogHeader>
        <TodoForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}
