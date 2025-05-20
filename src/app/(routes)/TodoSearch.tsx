import { Input } from '@/components/ui/input'
import { useAuthenticationQuery } from '@/quries/use-authentication-query'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

export const TodoSearch: FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('q') || ''

    setSearchTerm(query)
  }, [location.search])

  useEffect(() => {
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`)
    } else {
      navigate('/')
    }
  }, [searchTerm, navigate])

  const { authenticationQuery } = useAuthenticationQuery()
  if (authenticationQuery.isLoading || !authenticationQuery.data) {
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
      />
    </div>
  )
}
