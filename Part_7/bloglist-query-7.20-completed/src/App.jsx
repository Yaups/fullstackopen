import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import Togglable from './components/Togglable'
import Message from './components/Message'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import axios from 'axios'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [sortedBlogs, setSortedBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [error, setError] = useState(false)
  const [message, setMessage] = useState(null)
  const [timeoutId, setTimeoutId] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const existingUser = JSON.parse(window.localStorage.getItem('user'))
    if (existingUser) {
      setUser(existingUser)
    }
  }, [])

  useEffect(() => {
    setSortedBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }, [blogs])

  const performLogin = async (username, password) => {
    try {
      const response = await axios.post('/api/login', { username, password })

      if (response) {
        setUser(response.data)
        window.localStorage.setItem('user', JSON.stringify(response.data))
      }
    } catch {
      broadcastMessage(
        'Login failed. Check username/password and connection to server.',
        'errorMessage',
      )
    }
  }

  const logout = () => {
    setUser(null)
    window.localStorage.removeItem('user')
  }

  const postBlog = async (newBlog) => {
    try {
      const verifiedBlog = await blogService.post(newBlog, user.token)
      const blogToAdd = {
        ...verifiedBlog,
        user: { name: user.name, username: user.username },
      }
      setBlogs([...blogs, blogToAdd])
      broadcastMessage(`New blog added: ${verifiedBlog.title}`)
    } catch {
      broadcastMessage(
        'Posting blog failed. Perhaps login has timed out?',
        'errorMessage',
      )
    }
  }

  const upvoteBlog = async (id, blogToUpdate) => {
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
    try {
      const upvoteResponse = await blogService.update(id, updatedBlog)
      const blogToAdd = {
        ...upvoteResponse,
        user: {
          name: blogToUpdate.user.name,
          username: blogToUpdate.user.username,
        },
      }
      const blogsWithOldRemoved = blogs.filter((blog) => blog.id !== id)
      const blogsWithNewUpvote = [...blogsWithOldRemoved, blogToAdd]
      setBlogs(blogsWithNewUpvote)
    } catch {
      broadcastMessage('Upvote failed.', 'errorMessage')
    }
  }

  const deleteBlog = async (id) => {
    if (window.confirm('Would you really like to delete this post?')) {
      try {
        await blogService.remove(id, user.token)
        setBlogs(blogs.filter((blog) => blog.id !== id))
        broadcastMessage('Blog deleted successfully.')
      } catch {
        broadcastMessage(
          'Failed to delete blog. Perhaps you are not the blog poster?',
          'errorMessage',
        )
      }
    }
  }

  const broadcastMessage = (text, messageType) => {
    const isError = messageType === 'errorMessage' ? true : false
    clearTimeout(timeoutId)
    setError(isError)
    setMessage(text)
    const tid = setTimeout(() => {
      setMessage(null)
      setTimeoutId(null)
    }, 4000)
    setTimeoutId(tid)
  }

  const loginForm = () => <LoginForm performLogin={performLogin} />

  const blogsList = () => (
    <div>
      <hr />
      <li>
        <i>Logged in as {user.name}</i>
      </li>
      <button onClick={logout}>Log out</button>
      <hr />
      <p></p>
      <h2>Blogs:</h2>
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          user={user}
          handleDeletion={deleteBlog}
          handleUpvote={upvoteBlog}
        />
      ))}
      <hr />

      <Togglable buttonText="Open new blog form">
        <h2>Post a new blog:</h2>
        <BlogForm postBlog={postBlog} />
      </Togglable>
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
