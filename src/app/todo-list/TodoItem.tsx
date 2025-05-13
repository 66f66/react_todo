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
import { Todo } from '@/lib/types'
import { cn } from '@/lib/utils'
import { deleteTodo, updateTodo } from '@/service/todo.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { UpdateTodo } from './UpdateTodo'

const ItemTypes = {
  TODO: 'todo',
}

type TodoItemProps = {
  todo: Todo
  index: number
  totalElements: number
  moveTodo: (dragIndex: number, hoverIndex: number) => void
  onDrop: (todoId: number, newOrderNumber: number) => void
}

export const TodoItem: FC<TodoItemProps> = ({
  todo,
  index,
  totalElements,
  moveTodo,
  onDrop,
}) => {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.TODO,
    item: { id: todo.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [, drop] = useDrop(
    {
      accept: ItemTypes.TODO,
      hover(item: { id: number; index: number }) {
        if (!ref.current) return

        const dragIndex = item.index
        const hoverIndex = index

        if (dragIndex === hoverIndex) return

        moveTodo(dragIndex, hoverIndex)
        item.index = hoverIndex
      },
      drop(item) {
        onDrop(item.id, totalElements - index)
      },
    },
    [onDrop, todo.id],
  )

  drag(drop(ref))

  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  function onDelete(id: number) {
    deleteMutation.mutate(id)
  }

  const completeMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })
    },
    onError: (error) => {
      alert(error.message)
    },
  })

  function onComplete(id: number, value: boolean) {
    completeMutation.mutate({ id, todo: { completed: value } })
  }

  return (
    <div
      ref={ref}
      className='mb-3'
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <Card
        className='py-4'
        key={todo.id}
      >
        <CardHeader className='flex'>
          <Checkbox
            disabled={completeMutation.isPending}
            checked={todo.completed}
            onCheckedChange={() => onComplete(todo.id, !todo.completed)}
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
            <UpdateTodo
              id={todo.id}
              todo={todo}
            />

            <Button
              className='hover:cursor-pointer'
              variant={'outline'}
              onClick={() => onDelete(todo.id)}
            >
              삭제
            </Button>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  )
}
