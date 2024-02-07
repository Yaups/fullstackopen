/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import { LOG_IN } from '../queries'
import { useMutation } from '@apollo/client'

const LoginForm = ({ show, setUser, setPage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [submittedUser, setSubmittedUser] = useState('')

  const [login, result] = useMutation(LOG_IN, {
    /*onError: (error) => {
      setError(error.graphQLErrors[0].message)
    },
    */
  })

  const handleLogin = (event) => {
    event.preventDefault()
    setSubmittedUser(username)
    login({ variables: { username, password } })
  }

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setUser({ username: submittedUser, token })
      localStorage.setItem('library-username', submittedUser)
      localStorage.setItem('library-token', token)
      setUsername('')
      setPassword('')
      setPage('authors')
    }
  }, [result.data, setPage, setUser, submittedUser])

  if (!show) return null

  return (
    <div>
      <h2>Log in:</h2>
      <form onSubmit={handleLogin}>
        Username:{' '}
        <input
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        Password:{' '}
        <input
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type="submit">Log in</button>
      </form>
    </div>
  )
}

export default LoginForm
