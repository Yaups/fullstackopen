import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: { text: null, timeoutId: null },
  reducers: {
    setText(state, action) {
      return { ...state, text: action.payload }
    },
    clearText(state) {
      return { ...state, text: null }
    },
    setTimeoutId(state, action) {
      return { ...state, timeoutId: action.payload }
    }
  }
})

export const {
  setText,
  clearText,
  setTimeoutId
} = notificationSlice.actions

export const setNotificationText = (text, timeInSeconds) => {
  return async (dispatch, getState) => {
    const oldTimeoutId = getState().notification.timeoutId
    clearTimeout(oldTimeoutId)

    dispatch(setText(text))

    const timeInMs = timeInSeconds * 1000
    const newTimeoutId = setTimeout(() => dispatch(clearText()), timeInMs)
    dispatch(setTimeoutId(newTimeoutId))
  }
}

export default notificationSlice.reducer