import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer'

const AnecdoteForm = () => {
  const dispatch = useDispatch()

  const postAnecdote = event => {
    event.preventDefault()

    dispatch(addAnecdote(event.target.anecdoteText.value))
    event.target.anecdoteText.value = ''
  }

  return (
    <div>
      <h2>Create new anecdote:</h2>
      <form onSubmit={postAnecdote}>
        <div><input name='anecdoteText' /></div>
        <button type='submit'>Create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm