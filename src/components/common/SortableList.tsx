import { cn } from '@/lib/utils'
import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core'
import {
  SortableContext,
  SortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useCallback } from 'react'

type SortableListProps<T extends { id: number | string }> = {
  items: T[]
  reorderItems: (reorderedItems: T[]) => void
  onReorder: (reorderedItems: T[]) => void
  className?: string
  stratgey?: SortingStrategy
  children: React.ReactNode
}

export function SortableList<T extends { id: number | string }>({
  items,
  reorderItems,
  onReorder,
  className,
  stratgey = verticalListSortingStrategy,
  children,
}: SortableListProps<T>) {
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event

      if (active.id !== over?.id) {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over?.id)

        if (oldIndex !== -1 && newIndex !== -1) {
          const reordered = [...items]
          const [moved] = reordered.splice(oldIndex, 1)
          reordered.splice(newIndex, 0, moved)

          reorderItems(reordered)

          onReorder(reordered)
        }
      }
    },
    [items, reorderItems, onReorder],
  )

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={stratgey}
      >
        <div className={cn('p-2', className)}>{children}</div>
      </SortableContext>
    </DndContext>
  )
}
