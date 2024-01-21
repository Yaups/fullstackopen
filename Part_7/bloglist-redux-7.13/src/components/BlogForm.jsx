import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ postBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleBlogSubmit = async (event) => {
    event.preventDefault()

    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    }

    await postBlog(newBlog)

    setBlogTitle('')
    setBlogAuthor('')
    setBlogUrl('')
  }

  return (
    <form>
      Title: {''}
      <input
        type="text"
        value={blogTitle}
        onChange={({ target }) => setBlogTitle(target.value)}
        placeholder="Title of blog"
        id="blogForm-title-input"
      />
      <br />
      Author: {''}
      <input
        type="text"
        value={blogAuthor}
        onChange={({ target }) => setBlogAuthor(target.value)}
        placeholder="Author of blog"
        id="blogForm-author-input"
      />
      <br />
      URL: {''}
      <input
        type="text"
        value={blogUrl}
        onChange={({ target }) => setBlogUrl(target.value)}
        placeholder="Link to blog post"
        id="blogForm-url-input"
      />
      <br />
      <button
        type="submit"
        onClick={handleBlogSubmit}
        id="blogForm-post-button"
      >
        Add blog
      </button>
    </form>
  )
}

BlogForm.propTypes = {
  postBlog: PropTypes.func.isRequired,
}

export default BlogForm
