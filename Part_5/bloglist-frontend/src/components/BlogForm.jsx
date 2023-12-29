import { useState } from 'react'

const BlogForm = ({ postBlog }) => {

  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleBlogSubmit = async event => {
    event.preventDefault()

    const newBlog = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl
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
        type='text'
        value={blogTitle}
        onChange={({ target }) => setBlogTitle(target.value)}
      />
      <br />
      Author: {''}
      <input
        type='text'
        value={blogAuthor}
        onChange={({ target }) => setBlogAuthor(target.value)}
      />
      <br />
      URL: {''}
      <input
        type='text'
        value={blogUrl}
        onChange={({ target }) => setBlogUrl(target.value)}
      />
      <br />
      <button type='submit' onClick={handleBlogSubmit}>Add blog</button>
    </form>
  )
}

export default BlogForm