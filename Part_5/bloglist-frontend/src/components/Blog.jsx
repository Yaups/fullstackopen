import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, handleDeletion, handleUpvote }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteButton = () => (
    <button onClick={() => handleDeletion(blog.id)}>
      Delete
    </button >
  )

  const extraInfo = () => (
    <div>
      <a href={blog.url} target='_blank' rel="noreferrer">{blog.url}</a>
      <br />
      Likes: {blog.likes} {''}
      <button onClick={() => handleUpvote(blog.id, blog)}>Like</button>
      <br />
      Posted by {blog.user.name}.
      <br />
      {blog.user.username === user.username && deleteButton()}
    </div>
  )

  return (
    <div style={blogStyle} className='blog'>
      {blog.title} - {blog.author} {''}
      <button onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? 'Hide' : 'Show'}
      </button>
      {isExpanded && extraInfo()}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  handleDeletion: PropTypes.func.isRequired,
  handleUpvote: PropTypes.func.isRequired
}

export default Blog