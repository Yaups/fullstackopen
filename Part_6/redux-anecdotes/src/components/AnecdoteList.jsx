import { useDispatch, useSelector } from 'react-redux'
import { applyUpvote } from '../reducers/anecdoteReducer'
import { setNotificationText } from '../reducers/notificationReducer'
import PropTypes from 'prop-types'

const Anecdote = ({ anecdote, handleUpvote }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes} upvotes.{' '}
        <button onClick={() => handleUpvote(anecdote)}>
          Upvote
        </button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(state =>
    state.anecdotes.filter(a =>
      a.content.toLowerCase().includes(state.filter.toLowerCase())
    )
  )

  const dispatch = useDispatch()

  const vote = ({ id, content }) => {
    dispatch(applyUpvote(id))
    dispatch(setNotificationText(`You voted for "${content}"`))
  }

  return (
    <div>
      {anecdotes
        .sort((a, b) => b.votes - a.votes)
        .map(anecdote =>
          <Anecdote key={anecdote.id} anecdote={anecdote} handleUpvote={vote} />
        )
      }
    </div>
  )
}

Anecdote.propTypes = {
  anecdote: PropTypes.object.isRequired,
  handleUpvote: PropTypes.func.isRequired
}

export default AnecdoteList