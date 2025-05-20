import { SignedOut } from '@/components/common/SignedOut'
import { UserButton } from '@/components/common/UserButton'
import { useTodosQuery } from '@/hooks/use-todos-query'
import { useIsMutating } from '@tanstack/react-query'
import { Loader } from 'lucide-react'
import { FC } from 'react'
import { Link } from 'react-router'
import { TodoSearch } from './TodoSearch'

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
          <SignedOut>
            <Link to='/auth/sign-in'>로그인</Link>
          </SignedOut>
          <UserButton />
        </div>
      </nav>
    </header>
  )
}

const TodosStatus: FC = () => {
  const {
    todosQuery: { isPending },
  } = useTodosQuery()

  const isMutating = useIsMutating({
    predicate: (mutation) => mutation.options.mutationKey?.[0] === 'todos',
  })

  if (!isPending && !isMutating) {
    return null
  }

  return (
    <div className='hidden md:inline'>
      <Loader className='animate-spin' />
    </div>
  )
}
