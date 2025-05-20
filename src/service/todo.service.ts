import { API_URL } from '@/lib/constatns'
import { customFetch } from '@/lib/custom-fetch'
import { Page, Todo, UpdateOrderNumberRequest } from '@/lib/types.lib'

const TODO_BASE_URL = `${API_URL}/todos`

export const getTodos = async () => {
  const searchParams = new URLSearchParams(window.location.search)

  const page = searchParams.get('page') || '0'
  const search = searchParams.get('search')

  const params = new URLSearchParams()
  params.append('page', page)
  if (search) {
    params.append('search', search)
  }

  const url = `${TODO_BASE_URL}?${params.toString()}`

  const response = await customFetch(url, {
    method: 'GET',
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 데이터를 가져올 수 없습니다.')
  }

  const data = await response.json()

  return data as Page<Todo>
}

export const saveTodo = async (
  payload: Partial<Pick<Todo, 'title' | 'description' | 'completed'>> & {
    id?: number
  },
) => {
  let response
  if (!payload.id) {
    response = await customFetch(TODO_BASE_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } else {
    const url = `${TODO_BASE_URL}/${payload.id}`

    response = await customFetch(url, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  }

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }

  const data = await response.json()

  return data as Todo
}

export const updateTodoOrders = async (payload: UpdateOrderNumberRequest[]) => {
  const url = `${TODO_BASE_URL}/orders`

  const response = await customFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }
}

export const deleteTodo = async (id: number) => {
  const url = `${TODO_BASE_URL}/${id}`

  const response = await customFetch(url, {
    method: 'DELETE',
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }
}
