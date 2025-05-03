export type Page<T> = {
  content: T[]
  last: boolean
  empty: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export type User = {
  id: number
  username: string
  password: string
  nickname: string
}

export type Todo = {
  id: number
  title: string
  description: string
  orderNumber: number
  completed: boolean
  createdAt: Date
  updatedAt: Date
  user: User
}
