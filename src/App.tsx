import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AuthenticatedRoute } from './components/AuthenticatedRoute'
import { Navbar } from './components/Navbar'
import { SignIn } from './sign-in/SignIn'
import { SignUp } from './sign-up/SignUp'
import { TodoList } from './todo-list/TodoList'

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
          </Routes>
        </main>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
