/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import { useApolloClient, useSubscription } from '@apollo/client'
import Recommended from './components/Recommended'
import { BOOK_ADDED, ALL_BOOKS } from './queries'

const updateCache = (cache, query, addedBook) => {
  const uniqById = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item._id
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return { allBooks: uniqById(allBooks.concat(addedBook)) }
  })
}

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
    const storedGenre = JSON.parse(
      JSON.stringify(localStorage.getItem('library-favoriteGenre'))
    )
    if (storedUser && storedToken) {
      setUser({
        username: storedUser,
        favoriteGenre: storedGenre,
        token: storedToken,
      })
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const newBookData = data.data.bookAdded
      //console.log(newBookData)
      updateCache(client.cache, { query: ALL_BOOKS }, newBookData)
      alert(`
        A new book has been added: 
        Title: ${newBookData.title}, 
        Author: ${newBookData.author.name}, 
        Published: ${newBookData.published},
        Genres: ${newBookData.genres}
        `)
    },
  })

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
        {user && (
          <button onClick={() => setPage('recommended')}>Recommended</button>
        )}
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

      <Recommended show={page === 'recommended'} user={user} />
    </div>
  )
}

export default App
