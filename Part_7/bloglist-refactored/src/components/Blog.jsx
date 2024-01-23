import { upvoteBlog, deleteBlog } from '../reducers/blogsReducer'
import { setNotification } from '../reducers/messageReducer'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import blogService from '../services/blogs'
import { postBlogComment } from '../reducers/blogsReducer'

const Blog = ({ blog }) => {
  const [commentText, setCommentText] = useState('')
  const user = useSelector(({ user }) => user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

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
      navigate('/blogs')
    }
  }

  const deleteButton = () => (
    <button onClick={() => handleDeletion()}>Delete</button>
  )

  const handleComment = async (event) => {
    event.preventDefault()
    dispatch(postBlogComment(blog, commentText))
    setCommentText('')
  }

  if (!blog) return null

  return (
    <div className="blogInfo">
      <h1>
        {blog.title} - {blog.author}
      </h1>
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
        <br />
        <h2>Comments:</h2>
        <form>
          <input
            placeholder="Your comment here"
            value={commentText}
            onChange={({ target }) => setCommentText(target.value)}
          />
          <button type="submit" onClick={handleComment}>
            Post comment
          </button>
        </form>
        <ul>
          {blog.comments.map((comment) => (
            <li key={comment._id}>{comment.text}</li>
          ))}
        </ul>
        {blog.user.username === user.username && deleteButton()}
      </div>
    </div>
  )
}

export default Blog
