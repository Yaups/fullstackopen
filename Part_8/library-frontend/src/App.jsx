/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [user, setUser] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const storedUser = JSON.parse(
      JSON.stringify(localStorage.getItem('library-username'))
    )
    const storedToken = JSON.parse(
      JSON.stringify(localStorage.getItem('library-token'))
    )
    if (storedUser && storedToken) {
      setUser({ username: storedUser, token: storedToken })
    }
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.clear()
    setPage('authors')
    client.resetStore()
  }

  return (
    <div>
      {user && (
        <div>
          <i>{user.username} logged in</i>
          <hr />
        </div>
      )}
      <div>
        <button onClick={() => setPage('authors')}>Authors</button>
        <button onClick={() => setPage('books')}>Books</button>
        {user && <button onClick={() => setPage('add')}>Add book</button>}
        {!user && <button onClick={() => setPage('loginForm')}>Log in</button>}
        {user && <button onClick={logout}>Log out</button>}
      </div>

      <LoginForm
        show={page === 'loginForm'}
        setUser={setUser}
        setPage={setPage}
      />

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />
    </div>
  )
}

export default App
