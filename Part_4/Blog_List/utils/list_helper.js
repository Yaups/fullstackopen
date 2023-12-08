const dummy = blogs => {
  if (blogs) return 1
  else return 0
}

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favouriteBlog = blogs => {
  if (blogs.length === 0) return null
  const likesList = blogs.map(blog => blog.likes)
  const maxValue = Math.max(...likesList)
  const index = likesList.indexOf(maxValue)
  const winningBlog = blogs[index]
  return (
    {
      title: winningBlog.title,
      author: winningBlog.author,
      likes: winningBlog.likes
    }
  )
}

const mostBlogs = blogs => {
  if (blogs.length === 0) return null

  const blogsAndAuthors = []
  blogs.forEach(blog => {
    const authorList = blogsAndAuthors.map(o => o.author)
    if (authorList.includes(blog.author)) {
      const index = authorList.indexOf(blog.author)
      blogsAndAuthors[index].blogs++
    }
    else {
      blogsAndAuthors.push(
        {
          author: blog.author,
          blogs: 1
        }
      )
    }
  })
  const numberOfBlogs = blogsAndAuthors.map(entry => entry.blogs)
  const maxValue = Math.max(...numberOfBlogs)
  const index = numberOfBlogs.indexOf(maxValue)
  return blogsAndAuthors[index]
}

const mostLikes = blogs => {
  if (blogs.length === 0) return null

  const likesAndAuthors = []
  blogs.forEach(blog => {
    const authorList = likesAndAuthors.map(o => o.author)
    if (authorList.includes(blog.author)) {
      const index = authorList.indexOf(blog.author)
      likesAndAuthors[index].likes += blog.likes
    }
    else {
      likesAndAuthors.push(
        {
          author: blog.author,
          likes: blog.likes
        }
      )
    }
  })
  const numberOfLikes = likesAndAuthors.map(entry => entry.likes)
  const maxValue = Math.max(...numberOfLikes)
  const index = numberOfLikes.indexOf(maxValue)
  return likesAndAuthors[index]
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}