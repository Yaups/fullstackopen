import { Link } from 'react-router-dom'

const UserInfo = ({ matchingUser }) => {
  if (!matchingUser) return null

  const listStyle = { listStyleType: 'none' }

  return (
    <div className="content">
      <h2>Blogs posted by {matchingUser.name}:</h2>
      <ul style={listStyle}>
        {matchingUser.blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UserInfo
