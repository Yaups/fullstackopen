import { useContext } from 'react'
import NotificationContext from './NotificationContext'

const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  const [notificationText, notificationDispatch] = useContext(NotificationContext)

  if (!notificationText) return null

  setTimeout(() =>
    notificationDispatch({
      type: 'CLEAR_TEXT'
    }), 5000
  )

  return (
    <div style={style}>
      {notificationText}
    </div>
  )
}

export default Notification
