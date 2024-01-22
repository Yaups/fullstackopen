import axios from 'axios'

const baseUrl = '/api/blogs'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const post = async (object, userToken) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `bearer ${userToken}`,
  }
  const response = await axios.post(baseUrl, object, { headers })
  return response.data
}

const update = async (id, updatedObject) => {
  const headers = { 'Content-Type': 'application/json' }
  const response = await axios.put(`${baseUrl}/${id}`, updatedObject, {
    headers,
  })
  return response.data
}

const remove = async (id, userToken) => {
  const headers = { Authorization: `bearer ${userToken}` }
  const response = await axios.delete(`${baseUrl}/${id}`, { headers })
  return response.data
}

export default { getAll, post, update, remove }
