import { useSelector } from 'react-redux'

const Notification = () => {
  const notificationText = useSelector(state => state.notification.text)

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  if (!notificationText) return null

  return (
    <div style={style}>
      {notificationText}
    </div>
  )
}

export default Notification