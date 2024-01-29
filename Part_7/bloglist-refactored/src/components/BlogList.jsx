import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const BlogList = () => {
  const blogs = useSelector(({ blogs }) => blogs)

  const blogStyle = {
    paddingTop: 10,
    marginBottom: 5,
  }

  return (
    <div>
      <h2 className="title">Blogs</h2>
      <Togglable buttonText="Open new blog form">
        <h5 className="title is-5">Post a new blog:</h5>
        <BlogForm />
      </Togglable>
      <br />
      <div className="container">
        {blogs
          .toSorted((a, b) => b.likes - a.likes)
          .map((blog) => (
            <div key={blog.id}>
              <div style={blogStyle} className="button is-light">
                <Link to={`/blogs/${blog.id}`}>
                  {blog.title} - {blog.author}
                </Link>
              </div>
              <br />
            </div>
          ))}
      </div>
      <hr />
    </div>
  )
}

export default BlogList
