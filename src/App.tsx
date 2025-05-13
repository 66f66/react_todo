import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router'
import { SignIn } from './app/SignIn'
import { SignUp } from './app/SignUp'
import { TodoList } from './app/todo-list/TodoList'
import { AuthenticatedRoute } from './components/AuthenticatedRoute'
import { Navbar } from './components/Navbar'
import { NotFound } from './components/NotFound'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Navbar />
        <main className='mt-[70px]'>
          <Routes>
            <Route
              path='/'
              element={
                <AuthenticatedRoute>
                  <TodoList />
                </AuthenticatedRoute>
              }
            />
            <Route
              path='/sign-up'
              element={<SignUp />}
            />
            <Route
              path='/sign-in'
              element={<SignIn />}
            />
            <Route
              path='*'
              element={<NotFound />}
            />
          </Routes>
        </main>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
