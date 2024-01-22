import { useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { deleteBlog, upvoteBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/messageReducer'

const Blog = ({ blog }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const user = useSelector(({ user }) => user)
  const dispatch = useDispatch()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const handleUpvote = () => {
    dispatch(upvoteBlog(blog.id, blog))
    dispatch(setNotification(`Blog liked: ${blog.title}`, 5, false))
  }

  const handleDeletion = () => {
    if (window.confirm('Would you really like to delete this post?')) {
      dispatch(deleteBlog(blog.id))
      dispatch(
        setNotification(`Blog ${blog.title} deleted successfully.`, 5, false),
      )
    }
  }

  const deleteButton = () => (
    <button onClick={() => handleDeletion()}>Delete</button>
  )

  const extraInfo = () => (
    <div>
      <a href={blog.url} target="_blank" rel="noreferrer">
        {blog.url}
      </a>
      <br />
      Likes: {blog.likes} {''}
      <button onClick={() => handleUpvote()}>Like</button>
      <br />
      Posted by {blog.user.name}.
      <br />
      {blog.user.username === user.username && deleteButton()}
    </div>
  )

  return (
    <div style={blogStyle} className="blog">
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
}

export default Blog
