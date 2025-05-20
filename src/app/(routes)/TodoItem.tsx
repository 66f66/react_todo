import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DialogTrigger } from '@/components/ui/dialog'
import { Page, Todo } from '@/lib/types.lib'
import { cn } from '@/lib/utils'
import { deleteTodo, saveTodo } from '@/service/todo.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useRef, useState } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { toast } from 'sonner'
import { TodoFormDialog } from './TodoFormDialog'

type TodoItemProps = {
  todo: Todo
  index: number
  moveTodo: (dragIndex: number, hoverIndex: number) => void
  onDrop: () => void
}

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  index,
  moveTodo,
  onDrop,
}) => {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'todo',

    item: { id: todo.id, index },

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop(
    {
      accept: 'todo',

      hover(item: { id: number; index: number }) {
        if (!ref.current) return

        const dragIndex = item.index
        const hoverIndex = index

        if (dragIndex === hoverIndex) return

        moveTodo(dragIndex, hoverIndex)

        item.index = hoverIndex
      },

      drop() {
        onDrop()
      },
    },
    [onDrop, todo.id],
  )

  drag(drop(ref))

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: saveTodo,

    mutationKey: ['todos', 'save'],

    onSuccess: (data) => {
      queryClient.setQueryData<Page<Todo>>(['todos'], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          content: oldData.content.map((todo) =>
            todo.id === data.id ? data : todo,
          ),
        }
      })

      toast('작업을 업데이트 했습니다', {
        description: data.title,
      })
    },

    onError: (error) => {
      toast('작업을 업데이트 하지 못했습니다 😢', {
        description: error.message,
      })
    },
  })

  function onComplete(value: boolean) {
    mutation.mutate({ ...todo, completed: value })
  }

  return (
    <div
      ref={ref}
      className='relative mb-3'
      style={{
        transform: isDragging ? 'scale(1.05)' : 'scale(1)',
        transition: 'all 0.2s ease',
        zIndex: isDragging ? 1000 : 'auto',
        cursor: 'grab',
      }}
    >
      <Card
        className='py-4'
        key={todo.id}
      >
        <CardHeader className='flex'>
          <Checkbox
            disabled={mutation.isPending}
            checked={todo.completed}
            onCheckedChange={() => onComplete(!todo.completed)}
          />
          <CardTitle
            className={cn(
              todo.completed && 'text-muted-foreground line-through',
            )}
          >
            {todo.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription
            className={cn(
              todo.completed && 'text-muted-foreground',
              'break-words whitespace-pre-wrap',
            )}
          >
            {todo.description}
          </CardDescription>
        </CardContent>
        <CardFooter className='self-end'>
          <CardAction className='flex gap-2'>
            <TodoFormDialog
              id={todo.id}
              defaultValues={todo}
            >
              <DialogTrigger asChild>
                <Button
                  size={'sm'}
                  className='hover:cursor-pointer'
                >
                  편집
                </Button>
              </DialogTrigger>
            </TodoFormDialog>

            <DeleteTodoDialog id={todo.id} />
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  )
}

type DeleteTodoDialogProps = {
  id: number
}

const DeleteTodoDialog: FC<DeleteTodoDialogProps> = ({ id }) => {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,

    mutationKey: ['todos', 'delete'],

    onSuccess: (_, deletedTodoId) => {
      queryClient.setQueryData<Page<Todo>>(['todos'], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          content: oldData.content.filter((todo) => todo.id !== deletedTodoId),
        }
      })
    },

    onError: (error) => {
      toast('작업을 삭제하지 못했습니다 😢', {
        description: error.message,
      })
    },
  })

  function handleDelete(id: number) {
    deleteMutation.mutate(id)
  }

  return (
    <AlertDialog
      open={open}
      onOpenChange={setOpen}
    >
      <AlertDialogTrigger asChild>
        <Button
          className='hover:cursor-pointer'
          size={'sm'}
          variant='destructive'
        >
          삭제
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
          <AlertDialogDescription>
            이 행동은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='hover:cursor-pointer'>
            취소
          </AlertDialogCancel>
          <Button
            disabled={deleteMutation.isPending}
            variant={'destructive'}
            className='hover:cursor-pointer'
            onClick={() => handleDelete(id)}
          >
            {deleteMutation.isPending ? '처리중...' : '확인'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
