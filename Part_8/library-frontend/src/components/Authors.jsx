/* eslint-disable react/prop-types */
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'
import { useQuery, useMutation } from '@apollo/client'
import { useState } from 'react'
import Select from 'react-select'

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)
  const [updateAuthor] = useMutation(UPDATE_AUTHOR)
  const [authorToUpdate, setAuthorToUpdate] = useState('')
  const [updatedBirthYear, setUpdatedBirthYear] = useState('')

  const handleBirthYearChange = (event) => {
    event.preventDefault()
    const yearAsNumber = Number(updatedBirthYear)

    console.log(authorToUpdate, updatedBirthYear)

    updateAuthor({
      variables: { name: authorToUpdate.value, setBornTo: yearAsNumber },
    })
  }

  if (!props.show || result.loading) return null

  const authors = result.data.allAuthors || []

  const authorOptions = authors.map((a) => {
    return { value: a.name, label: a.name }
  })

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Set Birthyear</h2>
      <form>
        Name:{' '}
        <Select
          defaultValue={authorToUpdate}
          onChange={setAuthorToUpdate}
          options={authorOptions}
        />
        <br />
        Year:{' '}
        <input
          value={updatedBirthYear}
          onChange={({ target }) => setUpdatedBirthYear(target.value)}
          placeholder="Year"
        />
        <br />
        <button type="submit" onClick={handleBirthYearChange}>
          Update author
        </button>
      </form>
    </div>
  )
}

export default Authors
