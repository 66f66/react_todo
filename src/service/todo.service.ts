import { API_URL } from '@/lib/constatns'
import { customFetch } from '@/lib/custom-fetch'
import { Page, Todo } from '@/lib/types'

const TODO_BASE_URL = `${API_URL}/todos`

export const fetchTodos = async () => {
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

export const createTodo = async (todo: Partial<Todo>) => {
  const response = await customFetch(TODO_BASE_URL, {
    method: 'POST',
    body: JSON.stringify(todo),
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }

  const data = await response.json()

  return data as Todo
}

export const updateTodo = async ({
  id,
  todo,
}: {
  id: number
  todo: Partial<Todo>
}) => {
  const url = `${TODO_BASE_URL}/${id}`

  const response = await customFetch(url, {
    method: 'PATCH',
    body: JSON.stringify(todo),
  })

  if (!response.ok) {
    const error = await response.json()

    throw new Error(error?.message || '현재 요청을 처리할 수 없습니다.')
  }

  const data = await response.json()

  return data as Todo
}

export const updateTodoOrderNumber = async ({
  todoId,
  newOrderNumber,
}: {
  todoId: number
  newOrderNumber: number
}) => {
  const url = `${TODO_BASE_URL}/${todoId}/order?newOrderNumber=${newOrderNumber}`

  const response = await customFetch(url, {
    method: 'PATCH',
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
