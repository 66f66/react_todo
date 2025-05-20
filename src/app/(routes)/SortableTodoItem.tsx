import { TodoItem } from '@/components/TodoItem'
import { Todo } from '@/lib/types.lib'
import { FC, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

type SoratableTodoItemProps = {
  todo: Todo
  index: number
  moveTodo: (dragIndex: number, hoverIndex: number) => void
  onDrop: () => void
}

export const SortableTodoItem: FC<SoratableTodoItemProps> = ({
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
      <TodoItem todo={todo} />
    </div>
  )
}
