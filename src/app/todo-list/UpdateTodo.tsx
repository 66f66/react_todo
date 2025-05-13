import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Todo } from '@/lib/types'
import { DialogDescription } from '@radix-ui/react-dialog'
import { FC, useState } from 'react'
import { TodoForm } from './TodoForm'

type UpdateTodoProps = {
  id: number
  todo: Partial<Todo>
}

export const UpdateTodo: FC<UpdateTodoProps> = ({ id, todo }) => {
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
          편집
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>편집</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <TodoForm
          setOpen={setOpen}
          id={id}
          intialValue={todo}
        />
      </DialogContent>
    </Dialog>
  )
}
