import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdoteSlice = createSlice({
  name: 'anecdote',
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      return ([...state, action.payload])
    },
    applyUpdate(state, action) {
      const updatedAnecdote = action.payload
      return state.map(a => a.id !== updatedAnecdote.id ? a : updatedAnecdote)
    },
    setAllAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { addAnecdote, applyUpdate, setAllAnecdotes } = anecdoteSlice.actions

export const initialiseAnecdotes = () => {
  return async dispatch => {
    const allAnecdotes = await anecdoteService.getAll()
    dispatch(setAllAnecdotes(allAnecdotes))
  }
}

export const postNewAnecdote = text => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.addNew(text)
    dispatch(addAnecdote(newAnecdote))
  }
}

export const upvoteAnecdote = id => {
  return async (dispatch, getState) => {
    const anecdoteToUpvote = getState().anecdotes.find(a => a.id === id)
    const upvotedAnecdote = { ...anecdoteToUpvote, votes: anecdoteToUpvote.votes + 1 }

    await anecdoteService.update(id, upvotedAnecdote)
    dispatch(applyUpdate(upvotedAnecdote))
  }
}

export default anecdoteSlice.reducer