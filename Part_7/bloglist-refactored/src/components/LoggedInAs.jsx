import { useSelector, useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'

const LoggedInAs = () => {
  const user = useSelector(({ user }) => user)
  const dispatch = useDispatch()

  const logout = () => {
    dispatch(setUser(null))
    window.localStorage.removeItem('user')
  }

  return (
    <div>
      <li>
        <i>Logged in as {user.name}</i>
      </li>
      <button onClick={logout}>Log out</button>
      <hr />
    </div>
  )
}

export default LoggedInAs
