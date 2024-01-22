import { setUser } from '../reducers/userReducer'
import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useSelector, useDispatch } from 'react-redux'
import Blog from './Blog'

const BlogList = () => {
  const user = useSelector(({ user }) => user)
  const blogs = useSelector(({ blogs }) => blogs)
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(setUser(null))
    window.localStorage.removeItem('user')
  }

  return (
    <div>
      <hr />
      <li>
        <i>Logged in as {user.name}</i>
      </li>
      <button onClick={logout}>Log out</button>
      <hr />
      <p></p>
      <h2>Blogs:</h2>
      {blogs
        .toSorted((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      <hr />

      <Togglable buttonText="Open new blog form">
        <h2>Post a new blog:</h2>
        <BlogForm />
      </Togglable>
    </div>
  )
}

export default BlogList
