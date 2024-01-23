const UserInfo = ({ matchingUser }) => {
  if (!matchingUser) return null

  return (
    <div>
      <h2>{matchingUser.name}</h2>
      <ul>
        {matchingUser.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default UserInfo
