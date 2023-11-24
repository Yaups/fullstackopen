import axios from 'axios'
const baseUrl = 'http://localhost:3001/persons'

const getAll = async () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const get = async id => {
  const request = axios.get(`${baseUrl}/${id}`)
  return request.then(response => response.data)
}

const create = async newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = async (id, updatedObject) => {
  const request = axios.put(`${baseUrl}/${id}`, updatedObject)
  return request.then(response => response.data)
}

const remove = async id => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

export default { getAll, get, create, update, remove }