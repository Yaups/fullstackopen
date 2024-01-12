import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const addNew = async text => {
  const newAnecdote = {
    content: text,
    votes: 0
  }
  const response = await axios.post(baseUrl, newAnecdote)
  return response.data
}

const update = async (id, updatedObject) => {
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject)
  return response.data
}

export default { getAll, addNew, update }