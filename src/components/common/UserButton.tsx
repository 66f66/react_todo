import { useAuthenticationQuery } from '@/hooks/use-authentication-query'
import { signOut } from '@/service/user.service'
import { useQueryClient } from '@tanstack/react-query'
import type { FC } from 'react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export const UserButton: FC = () => {
  const queryClient = useQueryClient()

  const {
    authenticationQuery: { isLoading, data },
  } = useAuthenticationQuery()

  const handleSignOut = async () => {
    await signOut()

    queryClient.removeQueries({
      queryKey: ['authentication'],
    })

    window.location.reload()
  }

  if (isLoading || !data) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={'ghost'}
          size={'sm'}
          className='hover:cursor-pointer'
        >
          {data.nickname}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={handleSignOut}
          className='hover:cursor-pointer'
        >
          로그아웃
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
