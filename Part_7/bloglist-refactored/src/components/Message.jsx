import { useSelector } from 'react-redux'

const Message = () => {
  const [message, error] = useSelector(({ message }) => [
    message.text,
    message.error,
  ])

  if (!message) return null

  const baseStyle = {
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }
  const errorStyle = { ...baseStyle, color: 'red' }
  const successStyle = { ...baseStyle, color: 'green' }
  const selectedStyle = error ? errorStyle : successStyle

  return (
    <div id="notification-message" style={selectedStyle}>
      {message}
    </div>
  )
}

export default Message
