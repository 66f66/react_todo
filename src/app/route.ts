import { NotFoundPage } from '@/components/common/NotFoundPage'
import { createBrowserRouter } from 'react-router'
import { HomeLayout } from './(routes)/HomeLayout'
import { HomePage } from './(routes)/HomePage'
import { AuthLayout } from './auth/AuthLayout'
import { AuthSignInPage } from './auth/sign-in/AuthSignInPage'
import { AuthSignUpPage } from './auth/sign-up/AuthSignUpPage'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: HomeLayout,
    children: [{ index: true, Component: HomePage }],
  },
  {
    path: 'auth',
    Component: AuthLayout,
    children: [
      { path: 'sign-in', Component: AuthSignInPage },
      { path: 'sign-up', Component: AuthSignUpPage },
    ],
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
])
