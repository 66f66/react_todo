import { API_URL } from '@/lib/constatns'
import { customFetch } from '@/lib/custom-fetch'
import { User } from '@/lib/types.lib'

const USER_BASE_URL = `${API_URL}/users`

export const signUp = async (
  payload: Pick<User, 'nickname' | 'password' | 'username'>,
) => {
  const url = `${USER_BASE_URL}/sign-up`

  const response = await customFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }
}

export const existsUsername = async (username: string) => {
  const url = `${USER_BASE_URL}/exists?q=${encodeURIComponent(username)}`

  const response = await customFetch(url, {
    method: 'GET',
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message)
  }

  const data = await response.json()

  return data.exists as boolean
}

export const signIn = async (payload: Pick<User, 'username' | 'password'>) => {
  const url = `${USER_BASE_URL}/sign-in`

  const response = await customFetch(url, {
    method: 'POST',
    body: JSON.stringify(payload),
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }

  const data = await response.json()

  storeAccessToken(data.accessToken)
}

export const storeAccessToken = (token: string) => {
  localStorage.setItem('token', token)
}

export const getAccessToken = () => {
  return localStorage.getItem('token')
}

export const removeAccessToken = () => {
  localStorage.removeItem('token')
}

export const isAuthenticated = getAccessToken() !== null

export const getAuthentication = async () => {
  const url = `${USER_BASE_URL}/authentication`

  const response = await customFetch(url, {
    method: 'GET',
  })

  if (!response.ok) {
    const error = await response.json()

    removeAccessToken()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }

  const data = await response.json()

  return data as User
}

export const signOut = async () => {
  removeAccessToken()

  const url = `${USER_BASE_URL}/sign-out`

  await customFetch(url, {
    method: 'DELETE',
    credentials: 'include',
  })
}
