import { useSessionQuery } from '@/hooks/use-session-query'
import { useTodoQuery } from '@/hooks/use-todo-query'
import { signOut } from '@/service/user.service'
import { Loader } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router'
import { TodoSearch } from './TodoSearch'
import { Button } from './ui/button'

export const Navbar = () => {
  return (
    <header className='fixed top-0 z-50 w-full bg-white/80 shadow-sm backdrop-blur-sm'>
      <nav className='mx-auto grid min-h-[70px] max-w-6xl grid-cols-8 px-4 py-4'>
        <div className='col-span-2 flex items-center gap-1'>
          <Link
            to='/'
            className='text-xl font-bold'
          >
            Home
          </Link>
          <a
            className='hidden text-blue-500 md:inline'
            href='https://github.com/66f66/react_todo'
            target='_blank'
          >
            코드
          </a>
        </div>

        <div className='col-span-4'>
          <TodoSearch />
        </div>

        <div className='col-span-2 flex items-center justify-end gap-2'>
          <TodosStatus />
          <UserButton />
        </div>
      </nav>
    </header>
  )
}

const TodosStatus: FC = () => {
  const {
    todosQuery: { isFetching },
  } = useTodoQuery()
  const {
    sessionQuery: { isLoading },
  } = useSessionQuery()

  if (!isFetching || isLoading) {
    return null
  }

  return (
    <div className='hidden md:inline'>
      <Loader />
    </div>
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
