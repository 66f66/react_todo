import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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
import { Todo } from '@/lib/types'
import { createTodo, updateTodo } from '@/service/todo.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, {
      message: '제목은 필수 값입니다.',
    })
    .max(20, {
      message: '제목은 20자 이하입니다.',
    }),
  description: z.string().max(100, {
    message: '설명은 100자 이하입니다.',
  }),
  completed: z.boolean(),
})

type TodoFormProps = {
  setOpen: (value: boolean) => void
  id?: number
  intialValue?: Partial<Todo>
}

export const TodoForm: FC<TodoFormProps> = ({ setOpen, id, intialValue }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: intialValue
      ? intialValue
      : {
          title: '',
          description: '',
          completed: false,
        },
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })

      setOpen(false)
    },
    onError: (error) => {
      console.error(error.message)
      alert(error.message)
    },
  })

  const updateMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })

      setOpen(false)
    },
    onError: (error) => {
      console.error(error.message)
      alert(error.message)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (id) {
      updateMutation.mutateAsync({ id, todo: values })
    } else {
      createMutation.mutateAsync(values)
    }
  }

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-6'
        >
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
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
            disabled={
              createMutation.isPending ||
              updateMutation.isPending ||
              !form.formState.isValid
            }
          >
            {createMutation.isPending || updateMutation.isPending
              ? '처리중...'
              : '저장'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
