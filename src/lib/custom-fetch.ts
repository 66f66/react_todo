import { getAccessToken, storeAccessToken } from '@/service/user.service'
import { API_URL } from './constatns'

export const customFetch = async (
  url: string,
  options: Partial<RequestInit>,
) => {
  const headers: Record<string, string> = {}

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  if (options.headers) {
    Object.assign(headers, options.headers)
  }

  const accessToken = getAccessToken()

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  const mergedOptions = {
    ...options,
    headers,
  }

  const response = await fetch(url, mergedOptions)

  if (response.ok) {
    return response
  }

  if (accessToken && response.status === 401) {
    const refreshTokenUrl = `${API_URL}/users/refresh-token`

    const refreshResponse = await fetch(refreshTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (refreshResponse.ok) {
      const { newAccessToken } = await refreshResponse.json()
      storeAccessToken(newAccessToken)

      headers['Authorization'] = `Bearer ${newAccessToken}`
      const retryOptions = {
        ...mergedOptions,
        headers,
      }

      return await fetch(url, retryOptions)
    }

    return response
  }

  return response
}
