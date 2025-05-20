import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { existsUsername, signUp } from '@/service/user.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
  username: z
    .string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':",./<>?]{2,20}$/, {
      message: '아이디는 2-20자의 영문, 숫자, 특수문자만 사용 가능합니다',
    })
    .refine(
      async (username) => {
        const exists = await existsUsername(username)

        return !exists
      },
      {
        message: '이미 사용중인 아이디입니다',
      },
    ),
  password: z
    .string()
    .regex(/^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':",./<>?]{8,20}$/, {
      message: '비밀번호는 8-20자의 영문, 숫자, 특수문자만 사용 가능합니다',
    }),
  nickname: z.string().regex(/^[가-힣a-zA-Z0-9]{2,10}$/, {
    message: '닉네임은 2-10자의 한글, 영문, 숫자만 사용 가능합니다',
  }),
})

export const AuthSignUpPage: FC = () => {
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof formSchema>>({
    mode: 'onBlur',
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      nickname: '',
    },
  })

  const mutation = useMutation({
    mutationFn: signUp,

    onSuccess: () => {
      toast('회원가입 되었습니다 🎉', {
        action: {
          label: '확인',
          onClick: () => {},
        },
      })

      navigate('/auth/sign-in', { replace: true })
    },

    onError: (error) => {
      toast('회원가입 하지 못했습니다 😢', {
        description: error.message,
      })
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values)
  }

  return (
    <div className='container max-w-[250px]'>
      <div className='mb-4 flex items-center justify-center gap-1'>
        <h1>회원가입</h1>
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
                  <FormMessage />
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
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='nickname'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder='닉네임'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='submit'
              className='hover:cursor-pointer'
              disabled={mutation.isPending || !form.formState.isValid}
            >
              회원가입
            </Button>
          </form>
        </fieldset>
      </Form>
    </div>
  )
}
