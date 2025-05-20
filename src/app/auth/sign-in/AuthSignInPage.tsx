import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthenticationQuery } from '@/hooks/use-authentication-query'
import { signIn } from '@/service/user.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  username: z.string().trim().nonempty(),
  password: z.string().trim().nonempty(),
})

export const AuthSignInPage: FC = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { authenticationQuery } = useAuthenticationQuery()

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onChange',
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const mutation = useMutation({
    mutationFn: signIn,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['todos'],
      })

      const result = await authenticationQuery.refetch()

      toast('로그인 되었습니다', {
        description: `반갑습니다, ${result.data?.nickname} 님 😊`,
      })

      navigate('/', { replace: true })
    },

    onError: (error) => {
      toast('로그인 하지 못했습니다 😢', {
        description: error.message,
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutateAsync(values)
  }

  return (
    <div className='container max-w-[250px]'>
      <div className='mb-4 flex items-center justify-center gap-1'>
        <h1>로그인</h1>
      </div>
      <Form {...form}>
        <fieldset disabled={mutation.isPending}>
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
              disabled={mutation.isPending || !form.formState.isValid}
            >
              로그인
            </Button>

            <div className='text-muted-foreground text-center'>
              아직 회원이 아니라면 <br />
              <Link
                className='underline'
                to={'/auth/sign-up'}
              >
                회원가입
              </Link>
            </div>
          </form>
        </fieldset>
      </Form>
    </div>
  )
}
