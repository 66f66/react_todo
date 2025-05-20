export type Page<T> = {
  content: T[]
  last: boolean
  empty: boolean
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export const ROLE = ['ROLE_ADMIN', 'ROLE_USER'] as const
export type Role = (typeof ROLE)[number]

export type User = {
  id: number
  username: string
  password: string
  nickname: string
  role: Role
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

export type UpdateOrderNumberRequest = {
  id: number
  orderNumber: number
}
