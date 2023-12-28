import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Message from './components/Message'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])


  useEffect(() => {
    const existingUser = JSON.parse(window.localStorage.getItem('user'))
    if (existingUser) {
      setUser(existingUser)
    }
  }, [])


  const login = async () => {
    try {
      const response = await axios.post('/api/login', ({ username, password }))
      setUsername('')
      setPassword('')
      return response
    }
    catch {
      broadcastMessage('Login failed. Check username/password and connection to server.', 'errorMessage')
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    const response = await login()
    if (response) {
      setUser(response.data)
      window.localStorage.setItem('user', JSON.stringify(response.data))
    }
  }

  const handleBlogSubmit = async event => {
    event.preventDefault()
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `bearer ${user.token}`
    }
    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
    }
    try {
      const postedBlogResponse = await axios.post('/api/blogs', newBlog, { headers })
      setBlogs([...blogs, postedBlogResponse.data])
      broadcastMessage(`New blog added: ${postedBlogResponse.data.title}`)
      setBlogTitle('')
      setBlogAuthor('')
      setBlogUrl('')
    }
    catch {
      broadcastMessage('Posting blog failed. Perhaps login has timed out?', 'errorMessage')
    }
  }

  const broadcastMessage = (msg, messageType) => {
    const isError = messageType === 'errorMessage' ? true : false
    clearTimeout(timeoutId)
    setError(isError)
    setMessage(msg)
    const tid = setTimeout(() => {
      setMessage(null)
      setTimeoutId(null)
    }
      , 4000)
    setTimeoutId(tid)
  }

  const loginForm = () => (
    <div>
      <h2>Log in:</h2>
      <form>
        Username: {''}
        <input type='text' value={username} onChange={({ target }) => setUsername(target.value)} />
        <br />
        Password: {''}
        <input type='password' value={password} onChange={({ target }) => setPassword(target.value)} />
        <br />
        <button type='submit' onClick={handleLogin}>Log in</button>
      </form>
    </div>
  )

  const blogsList = () => (
    <div>
      <hr />
      <li><i>Logged in as {user.name}</i></li>
      <button onClick={logout}>Log out</button>
      <hr />
      <p></p>
      <h2>Blogs:</h2>
      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
        />
      )}
      <hr />
      <h2>Post a new blog:</h2>
      <form>
        Title: {''} <input
          type='text'
          value={blogTitle}
          onChange={({ target }) => setBlogTitle(target.value)}
        />
        <br />
        Author: {''} <input
          type='text'
          value={blogAuthor}
          onChange={({ target }) => setBlogAuthor(target.value)}
        />
        <br />
        URL: {''} <input
          type='text'
          value={blogUrl}
          onChange={({ target }) => setBlogUrl(target.value)}
        />
        <br />
        <button type='submit' onClick={handleBlogSubmit}>Add blog</button>
      </form>
    </div>
  )

  return (
    <div>
      <Message error={error} message={message} />
      {!user && loginForm()}
      {user && blogsList()}
    </div>
  )
}

export default App