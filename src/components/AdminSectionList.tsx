import { SortableItem } from '@/components/common/SortableItem'
import { SortableList } from '@/components/common/SortableList'
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
import { DialogTrigger } from '@/components/ui/dialog'
import type { Course, Section } from '@/lib/types.lib'
import { cn } from '@/lib/utils'
import { deleteSection, updateSectionOrders } from '@/services/section.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EyeClosedIcon } from 'lucide-react'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { SectionFormDialog } from './SectionFormDialog'

type SectionListProps = {
  courseId: number
  sections: Section[]
}

export const AdminSectionList: FC<SectionListProps> = ({
  courseId,
  sections,
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateSectionOrders,

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['course', courseId] })

      const oldData = queryClient.getQueryData<Course>(['course', courseId])

      return { oldData }
    },

    onError: (error, _variables, context) => {
      toast('순서를 변경할 수 없습니다', {
        description: error.message,
      })

      if (context?.oldData) {
        queryClient.setQueryData(['course', courseId], context.oldData)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['course', courseId],
      })
    },
  })

  const reorderItems = useCallback(
    (reorderedSections: Section[]) => {
      queryClient.setQueryData<Course>(['course', courseId], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          reorderedSections,
        }
      })
    },
    [queryClient, courseId],
  )

  const handleReorder = (reorderedSections: Section[]) => {
    mutation.mutate(
      reorderedSections.map((section, index) => ({
        id: section.id,
        orderNum: index,
      })),
    )
  }

  return (
    <SortableList
      items={sections}
      reorderItems={reorderItems}
      onReorder={handleReorder}
    >
      {sections.map((section) => (
        <SectionItem
          key={section.id}
          courseId={courseId}
          section={section}
        />
      ))}
    </SortableList>
  )
}

type SectionItemProps = {
  courseId: number
  section: Section
}

const SectionItem: FC<SectionItemProps> = ({ courseId, section }) => {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteSection,

    onSuccess: (_, deletedSectionId) => {
      queryClient.setQueryData<Course>(['course', courseId], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          sections: oldData.sections.filter(
            (section) => section.id !== deletedSectionId,
          ),
        }
      })

      toast('챕터를 삭제했습니다')

      setOpen(false)
    },

    onError: (error) => {
      toast('챕터를 삭제하지 못했습니다', {
        description: error.message,
      })
    },
  })

  const handleDelete = (id: number) => {
    mutation.mutate(id)
  }

  return (
    <SortableItem
      id={section.id}
      className='gap-2 p-2'
    >
      <div className='contents'>
        <div
          className={cn(
            'flex items-center gap-1',
            section.status === 'PRIVATE' && 'text-muted-foreground',
          )}
        >
          {section.status === 'PRIVATE' && <EyeClosedIcon className='size-4' />}
          {section.name}
        </div>

        <SectionFormDialog
          courseId={courseId}
          defaultValues={section}
        >
          <DialogTrigger asChild>
            <Button
              size={'sm'}
              className='ml-auto hover:cursor-pointer'
              variant={'outline'}
            >
              편집
            </Button>
          </DialogTrigger>
        </SectionFormDialog>

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
                disabled={mutation.isPending || mutation.isSuccess}
                variant={'destructive'}
                className='hover:cursor-pointer'
                onClick={() => handleDelete(section.id)}
              >
                {mutation.isPending ? '처리중...' : '확인'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SortableItem>
  )
}
