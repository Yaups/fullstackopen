import { useEffect } from 'react'
import Message from './components/Message'
import LoginForm from './components/LoginForm'
import BlogList from './components/BlogList'
import { useDispatch, useSelector } from 'react-redux'
import { initialiseBlogs } from './reducers/blogsReducer'
import { setUser } from './reducers/userReducer'

const App = () => {
  const user = useSelector(({ user }) => user)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initialiseBlogs())
  }, [dispatch])

  useEffect(() => {
    const existingUser = JSON.parse(window.localStorage.getItem('user'))
    if (existingUser) {
      dispatch(setUser(existingUser))
    }
  }, [dispatch])

  return (
    <div>
      <Message />

      {!user && <LoginForm />}

      {user && <BlogList />}
    </div>
  )
}

export default App
