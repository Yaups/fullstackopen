import { useNavigate } from 'react-router-dom'
import { useField } from '../hooks'

const CreateNew = props => {
  const [content, resetContent] = useField('text')
  const [author, resetAuthor] = useField('text')
  const [info, resetInfo] = useField('text')

  const navigate = useNavigate()

  const handleSubmit = e => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })

    navigate('/anecdotes')
    props.broadcastMessage(`New anecdote ${content.value} created!`)
  }

  const handleClear = e => {
    e.preventDefault()
    resetContent()
    resetAuthor()
    resetInfo()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type='submit'>Create</button>
        <button onClick={handleClear}>Reset</button>
      </form>
    </div>
  )
}


import { PropTypes } from 'prop-types'

CreateNew.propTypes = {
  addNew: PropTypes.func.isRequired,
  broadcastMessage: PropTypes.func.isRequired
}

export default CreateNew