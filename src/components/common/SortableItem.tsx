import { cn } from '@/lib/utils'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVerticalIcon } from 'lucide-react'

type SortableItemProps = {
  id: number | string
  children: React.ReactNode
  className?: string
}

export function SortableItem({ id, children, className }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id })

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 'auto',
    position: isDragging ? 'relative' : 'static',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'bg-background flex rounded-lg',
        isDragging && 'z-50 shadow-lg',
        className,
      )}
    >
      <GripVerticalIcon
        className='text-muted-foreground mr-2 size-5 cursor-move'
        {...attributes}
        {...listeners}
      />
      {children}
    </div>
  )
}
