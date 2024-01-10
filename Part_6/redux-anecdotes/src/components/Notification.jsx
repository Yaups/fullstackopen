import { useSelector, useDispatch } from 'react-redux'
import { clearNotificationText } from '../reducers/notificationReducer'

const Notification = () => {
  const dispatch = useDispatch()
  const notificationText = useSelector(state => state.notification)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (!notificationText) return null

  setTimeout(() => dispatch(clearNotificationText()), 5000)

  return (
    <div style={style}>
      {notificationText}
    </div>
  )
}

export default Notification