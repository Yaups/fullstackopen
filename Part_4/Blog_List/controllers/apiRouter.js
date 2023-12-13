const Blog = require('../models/blog')
const apiRouter = require('express').Router()


apiRouter.get('/api/blogs', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

apiRouter.get('/api/blogs/:id', async (request, response) => {
  const fetchedBlog = await Blog.findById(request.params.id)
  console.log(fetchedBlog)
  if (fetchedBlog) response.status(200).json(fetchedBlog)
  else response.status(404).end()
})

apiRouter.post('/api/blogs', async (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  const result = await blog.save()
  response.status(201).json(result)
})

apiRouter.put('/api/blogs/:id', async (request, response) => {
  const { title, author, url, likes } = request.body
  const updatedBlog = { title, author, url, likes }

  const blogToReturn = await Blog.findByIdAndUpdate(
    request.params.id,
    updatedBlog,
    { new: true, runValidators: true, context: 'query' }
  )
  if (blogToReturn) response.status(200).json(blogToReturn)
  else response.status(404).end()
})

apiRouter.delete('/api/blogs/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

module.exports = apiRouter