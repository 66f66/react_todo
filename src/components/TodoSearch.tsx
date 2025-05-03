import { useSessionQuery } from '@/hooks/use-session-query'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { Input } from './ui/input'

export const TodoSearch: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchParam, setSearchParams] = useSearchParams('')

  useEffect(() => {
    const initialQuery = searchParam.get('search') || ''

    setSearchTerm(initialQuery)
  }, [searchParam])

  useEffect(() => {
    if (searchTerm) {
      setSearchParams({ search: searchTerm })
    } else {
      setSearchParams()
    }
  }, [searchTerm, setSearchParams])

  const { sessionQuery } = useSessionQuery()
  if (sessionQuery.isLoading || !sessionQuery.data) {
    return
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div>
      <Input
        type='text'
        placeholder='검색어를 입력해보세요.'
        value={searchTerm}
        onChange={handleChange}
        className='search-input'
      />
    </div>
  )
}
