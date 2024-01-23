import { PropTypes } from "prop-types";

const Anecdote = ({ anecdote, handleVote }) => (
  <div>
    <h2>
      {anecdote.content} by {anecdote.author}
    </h2>
    <br />
    Votes: {anecdote.votes}{" "}
    <button onClick={() => handleVote(anecdote.id)}>Vote</button>
    <br />
    <br />
    <li>
      More info: <a href={anecdote.info}>{anecdote.info}</a>
    </li>
  </div>
);

Anecdote.propTypes = {
  anecdote: PropTypes.object,
  handleVote: PropTypes.func,
};

export default Anecdote;
