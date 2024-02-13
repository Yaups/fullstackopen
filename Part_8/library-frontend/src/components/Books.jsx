/* eslint-disable react/prop-types */
import { useQuery } from '@apollo/client'
import { ALL_BOOKS, BOOKS_BY_GENRE } from '../queries'
import { useState } from 'react'

const Books = (props) => {
  const [filterGenre, setFilterGenre] = useState(null)
  const result = useQuery(ALL_BOOKS)
  const genreResult = useQuery(BOOKS_BY_GENRE, {
    variables: { filterGenre },
  })

  if (!props.show || result.loading || genreResult.loading) return null

  const books = result.data.allBooks || []
  const filteredBooks = genreResult.data.allBooks || []
  const booksToShow = filterGenre ? filteredBooks : books

  const genres = books.map((b) => [...b.genres]).flat()
  const uniqueGenres = [...new Set(genres)]

  return (
    <div>
      <h2>Books</h2>
      {filterGenre && (
        <li>
          Showing books in genre <b>{filterGenre}</b>
        </li>
      )}
      <br />
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {booksToShow.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {uniqueGenres.map((genre) => (
        <button key={genre} onClick={() => setFilterGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilterGenre(null)}>All genres</button>
    </div>
  )
}

export default Books
