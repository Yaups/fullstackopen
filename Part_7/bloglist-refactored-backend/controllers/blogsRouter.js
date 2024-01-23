const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
const blogsRouter = require('express').Router()

blogsRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.get('/api/blogs/:id', async (request, response) => {
  const fetchedBlog = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  if (fetchedBlog) response.status(200).json(fetchedBlog)
  else response.status(404).end()
})

blogsRouter.post(
  '/api/blogs',
  middleware.userExtractor,
  async (request, response) => {
    const body = request.body
    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
      user: user.id,
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
)

blogsRouter.put('/api/blogs/:id', async (request, response) => {
  const { title, author, url, likes, comments } = request.body
  const updatedBlog = { title, author, url, likes, comments }

  const blogToReturn = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true, runValidators: true, context: 'query' }
  )
  if (blogToReturn) response.status(200).json(blogToReturn)
  else response.status(404).end()
})

blogsRouter.delete(
  '/api/blogs/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blogToDelete = await Blog.findById(request.params.id)

    if (!blogToDelete) {
      return response
        .status(400)
        .json({ error: 'Selected blog does not exist.' })
    }
    if (!request.user.id) {
      return response.status(401).json({ error: 'You are not logged in.' })
    }
    if (!(blogToDelete.user.toString() === request.user.id)) {
      return response
        .status(401)
        .json({ error: 'You are not the owner of this blog!' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  }
)

module.exports = blogsRouter
