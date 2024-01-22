import { configureStore } from '@reduxjs/toolkit'
import messageReducer from './reducers/messageReducer'
import blogsReducer from './reducers/blogsReducer'
import userReducer from './reducers/userReducer'

const store = configureStore({
  reducer: {
    message: messageReducer,
    blogs: blogsReducer,
    user: userReducer,
  },
})

export default store
