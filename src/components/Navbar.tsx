import { useSessionQuery } from '@/hooks/use-session-query'
import { signOut } from '@/service/user.service'
import { FC } from 'react'
import { Link } from 'react-router'
import { Button } from './ui/button'
import { Input } from './ui/input'

export const Navbar = () => {
  return (
    <header className='fixed top-0 z-50 w-full bg-white/80 shadow-sm backdrop-blur-sm'>
      <nav className='mx-auto flex min-h-[70px] max-w-6xl items-center justify-between px-4 py-4'>
        <Link
          to='/'
          className='text-xl font-bold'
        >
          Home
        </Link>

        <TodoSearch />

        <UserButton />
      </nav>
    </header>
  )
}

const TodoSearch: FC = () => {
  const { sessionQuery } = useSessionQuery()

  if (sessionQuery.isLoading || !sessionQuery.data) {
    return
  }

  return (
    <form>
      <Input placeholder='검색어를 입력해보세요.' />
    </form>
  )
}

const UserButton: FC = () => {
  const { sessionQuery } = useSessionQuery()

  if (sessionQuery.isLoading) {
    return
  }

  const handleSignOut = () => {
    signOut()

    window.location.reload()
  }

  return (
    <div className='flex items-center justify-center gap-4'>
      {!sessionQuery.data ? (
        <Button asChild>
          <Link to='/sign-in'>로그인</Link>
        </Button>
      ) : (
        <div className='flex items-center justify-center gap-2'>
          <Button
            onClick={handleSignOut}
            className='hover:cursor-pointer'
          >
            로그아웃
          </Button>
        </div>
      )}
    </div>
  )
}
