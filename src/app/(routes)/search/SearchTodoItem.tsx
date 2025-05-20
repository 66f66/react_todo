import { TodoFormDialog } from '@/components/TodoFormDialog'
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
import { Todo } from '@/lib/types.lib'
import { cn } from '@/lib/utils'
import { TodosQueryData, TodosQueryKey } from '@/quries/use-todos-query'
import { deleteTodo, saveTodo } from '@/service/todo.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useState } from 'react'
import { toast } from 'sonner'

type SearchTodoItemProps = {
  todo: Todo
}

export const SearchTodoItem: FC<SearchTodoItemProps> = ({ todo }) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: saveTodo,

    mutationKey: [TodosQueryKey, 'save'],

    onSuccess: (data) => {
      queryClient.setQueryData<TodosQueryData>([TodosQueryKey], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.map((todo) =>
              todo.id === data.id ? data : todo,
            ),
          })),
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
    <Card
      className='mb-3 py-4'
      key={todo.id}
    >
      <CardHeader className='flex'>
        <Checkbox
          disabled={mutation.isPending}
          checked={todo.completed}
          onCheckedChange={() => onComplete(!todo.completed)}
        />
        <CardTitle
          className={cn(todo.completed && 'text-muted-foreground line-through')}
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

    mutationKey: [TodosQueryKey, 'delete'],

    onSuccess: (_, deletedTodoId) => {
      queryClient.setQueryData<TodosQueryData>([TodosQueryKey], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            content: page.content.filter((todo) => todo.id !== deletedTodoId),
          })),
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
