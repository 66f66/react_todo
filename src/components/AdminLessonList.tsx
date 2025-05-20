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
import type { Course, Lesson } from '@/lib/types.lib'
import { cn } from '@/lib/utils'
import { updateLessonOrders } from '@/services/lesson.service'
import { deleteSection } from '@/services/section.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EyeClosedIcon } from 'lucide-react'
import type { FC } from 'react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { LessonFormDialog } from './LessonFormDialog'

type AdminLessonListProps = {
  courseId: number
  sectionId: number
  lessons: Lesson[]
}

export const AdminLessonList: FC<AdminLessonListProps> = ({
  courseId,
  sectionId,
  lessons,
}) => {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: updateLessonOrders,

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
    (reorderedLessons: Lesson[]) => {
      queryClient.setQueryData<Course>(['course', courseId], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          sections: oldData.sections.map((section) => {
            if (section.id === sectionId) {
              return {
                ...section,
                lessons: reorderedLessons,
              }
            } else {
              return section
            }
          }),
        }
      })
    },
    [queryClient, courseId, sectionId],
  )

  const handleReorder = (reorderedLessons: Lesson[]) => {
    mutation.mutate(
      reorderedLessons.map((section, index) => ({
        id: section.id,
        orderNum: index,
      })),
    )
  }

  return (
    <SortableList
      items={lessons}
      reorderItems={reorderItems}
      onReorder={handleReorder}
    >
      {lessons.map((lesson) => (
        <LessonItem
          key={lesson.id}
          courseId={courseId}
          sectionId={sectionId}
          lesson={lesson}
        />
      ))}
    </SortableList>
  )
}

type LessonItemProps = {
  courseId: number
  sectionId: number
  lesson: Lesson
}

const LessonItem: FC<LessonItemProps> = ({ courseId, sectionId, lesson }) => {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteSection,

    onSuccess: (_, deletedLessonId) => {
      queryClient.setQueryData<Course>(['course', courseId], (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          courseSections: oldData.sections.map((section) => {
            if (section.id === sectionId) {
              section.lessons.filter((lesson) => lesson.id !== deletedLessonId)
            } else {
              return section
            }
          }),
        }
      })

      toast('강의를 삭제했습니다')

      setOpen(false)
    },

    onError: (error) => {
      toast('강의를 삭제하지 못했습니다', {
        description: error.message,
      })
    },
  })

  const handleDelete = (id: number) => {
    mutation.mutate(id)
  }

  return (
    <SortableItem
      id={lesson.id}
      className='gap-2 p-2'
    >
      <div className='contents'>
        <div
          className={cn(
            'flex items-center gap-1',
            lesson.status === 'PRIVATE' && 'text-muted-foreground',
          )}
        >
          {lesson.status === 'PRIVATE' && <EyeClosedIcon className='size-4' />}
          {lesson.name}
        </div>

        <LessonFormDialog
          courseId={courseId}
          sectionId={sectionId}
          defaultValues={lesson}
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
        </LessonFormDialog>

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
                onClick={() => handleDelete(lesson.id)}
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
