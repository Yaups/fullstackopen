import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ performLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async event => {
    event.preventDefault()

    await performLogin(username, password)

    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Log in:</h2>
      <form>
        Username: {''}
        <input
          type='text'
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <br />
        Password: {''}
        <input
          type='password'
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <br />
        <button type='submit' onClick={handleSubmit}>Log in</button>
      </form>
    </div >
  )
}

LoginForm.propTypes = {
  performLogin: PropTypes.func.isRequired
}

export default LoginForm