import { RequiredLabelIcon } from '@/components/common/RequiedLabelIcon'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Todo } from '@/lib/types.lib'
import { TodosQueryData, TodosQueryKey } from '@/quries/use-todos-query'
import { saveTodo } from '@/service/todo.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { DialogTitle } from '@radix-ui/react-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC, ReactNode, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: '제목은 필수 값입니다',
    })
    .max(20, {
      message: '제목은 20자 이하입니다',
    }),
  description: z.string().max(100, {
    message: '설명은 100자 이하입니다',
  }),
  completed: z.boolean(),
})

type TodoFormProps = {
  id?: number
  defaultValues?: Partial<Todo>
  children: ReactNode
}

export const TodoFormDialog: FC<TodoFormProps> = ({
  id,
  defaultValues,
  children,
}) => {
  const [open, setOpen] = useState(false)

  const queryClient = useQueryClient()

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: '',
      description: '',
      completed: false,
    },
  })

  const mutation = useMutation({
    mutationFn: saveTodo,

    mutationKey: [TodosQueryKey, 'save'],

    onSuccess: async (data) => {
      queryClient.setQueryData<TodosQueryData>(TodosQueryKey, (oldData) => {
        if (!oldData) return oldData

        return {
          ...oldData,
          pages: oldData.pages.map((page, index) => ({
            ...page,
            content: defaultValues
              ? page.content.map((todo) => (todo.id === data.id ? data : todo))
              : index === 0
                ? [data, ...page.content]
                : page.content,
          })),
        }
      })

      setOpen(false)
    },

    onError: (error) => {
      toast('작업을 저장하지 못했습니다 😢', {
        description: error.message,
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = id ? { ...values, id } : values

    mutation.mutate(payload)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      {children}
      <DialogContent>
        <DialogTitle>
          {!defaultValues ? '새 작업' : `${defaultValues.title} 편집`}
        </DialogTitle>
        <DialogHeader>
          <Form {...form}>
            <fieldset disabled={mutation.isPending}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-6'
              >
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        <RequiredLabelIcon />
                        제목
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder='제목을 입력하세요...'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        제목은 20자까지 입력 가능합니다.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='description'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>내용</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder='내용을 입력하세요...'
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        설명은 100자까지 입력 가능합니다. (선택)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='completed'
                  render={({ field }) => (
                    <FormItem className='flex items-center'>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className='text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                        완료
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  className='hover:cursor-pointer'
                  type='submit'
                  disabled={mutation.isPending || !form.formState.isValid}
                >
                  {mutation.isPending ? '처리중...' : '저장'}
                </Button>
              </form>
            </fieldset>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
