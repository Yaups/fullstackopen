import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotificationText(state, action) {
      return action.payload
    },
    clearNotificationText() {
      return null
    }
  }
})

export const {
  setNotificationText,
  clearNotificationText,
  setTimeoutId } = notificationSlice.actions

export default notificationSlice.reducer