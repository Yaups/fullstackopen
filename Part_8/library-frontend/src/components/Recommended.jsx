/* eslint-disable react/prop-types */
import { BOOKS_BY_GENRE } from '../queries'
import { useQuery } from '@apollo/client'

const Recommended = ({ show, user }) => {
  const filterGenre = user ? user.favoriteGenre : null

  const genreResult = useQuery(BOOKS_BY_GENRE, {
    variables: { filterGenre },
  })

  if (!show || genreResult.loading) return null

  const filteredBooks = genreResult.data.allBooks || []

  return (
    <div>
      <h2>Recommended books</h2>
      <li>
        Showing books in your favourite genre <b>{filterGenre}</b>
      </li>
      <br />
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {filteredBooks.map((b) => (
            <tr key={b.title}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
