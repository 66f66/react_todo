import { getAccessToken, storeAccessToken } from '@/service/user.service'
import { API_URL } from './constatns'

export const customFetch = async (
  url: string,
  options: Partial<RequestInit> = {},
) => {
  // localStorage에서 액세스 토큰 가져오기
  const accessToken = getAccessToken()

  // 기본 헤더 설정
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  // 액세스 토큰이 있으면 헤더에 추가
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  // 옵션에 헤더 병합
  const mergedOptions = {
    ...options,
    headers,
  }

  // 원본 요청 시도
  const response = await fetch(url, mergedOptions)

  // 성공 시 바로 반환
  if (response.ok) {
    return response
  }

  if (accessToken && response.status === 401) {
    const refreshTokenUrl = `${API_URL}/users/refresh-token`

    // 리프레시 토큰으로 새 액세스 토큰 요청
    const refreshResponse = await fetch(refreshTokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키를 전송하기 위해 필요
    })

    if (refreshResponse.ok) {
      // 새 액세스 토큰 저장
      const { newAccessToken } = await refreshResponse.json()
      storeAccessToken(newAccessToken)

      // 원본 요청 재시도 (헤더 업데이트)
      headers['Authorization'] = `Bearer ${newAccessToken}`
      const retryOptions = {
        ...mergedOptions,
        headers,
      }

      return await fetch(url, retryOptions)
    }

    // 액세스 토큰이 없거나 리프레시 토큰이 유효하지 않거나 없으면 401 반환
    return response
  }

  // 다른 에러는 그대로 반환
  return response
}
