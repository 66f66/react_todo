import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSessionQuery } from '@/hooks/use-session-query'
import { signIn } from '@/service/user.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Lock } from 'lucide-react'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
})

export const SignIn: FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const queryClient = useQueryClient()

  const { sessionQuery } = useSessionQuery()
  const navigate = useNavigate()
  const signInMutation = useMutation({
    mutationFn: signIn,

    onSuccess: () => {
      sessionQuery.refetch()

      queryClient.invalidateQueries({
        queryKey: ['todos'],
      })

      navigate('/', { replace: true })
    },

    onError: (error) => {
      alert(error.message)
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    signInMutation.mutateAsync(values)
  }

  return (
    <div className='flex min-h-[calc(100vh-210px)] items-center justify-center'>
      <div className='container max-w-[250px]'>
        <div className='mb-4 flex items-center justify-center gap-1'>
          <Lock
            width={20}
            height={20}
          />
          <h1>로그인</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col gap-4'
          >
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='아이디'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder='비밀번호'
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='hover:cursor-pointer'
              disabled={signInMutation.isPending || !form.formState.isValid}
            >
              로그인
            </Button>

            <div className='text-muted-foreground text-center'>
              아직 회원이 아니라면{' '}
              <Link
                className='underline'
                to={'/sign-up'}
              >
                회원가입
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
