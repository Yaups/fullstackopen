import { useReducer, createContext, useContext } from 'react'
import PropTypes from 'prop-types'

const notificationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEXT': {
      return action.payload
    }
    case 'CLEAR_TEXT': {
      return null
    }
    default: return state
  }
}

export const NotificationContextProvider = props => {
  const [notificationText, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notificationText, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

const NotificationContext = createContext()

NotificationContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NotificationContext