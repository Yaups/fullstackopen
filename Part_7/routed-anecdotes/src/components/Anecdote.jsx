import { PropTypes } from 'prop-types'

const Anecdote = ({ anecdote }) => (
  <div>
    <h2>{anecdote.content} by {anecdote.author}</h2>
    <br />
    Votes: {anecdote.votes}
    <br />
    <br />
    <li>More info: <a href={anecdote.info}>{anecdote.info}</a></li>
  </div>
)

Anecdote.propTypes = {
  anecdote: PropTypes.object
}

export default Anecdote