const supertest = require('supertest')
const testAssist = require('../utils/testAssist')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)

beforeAll(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(testAssist.initialBlogs)
})

test('Correct amount of blogs are received in JSON format', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  expect(response.body.length).toBe(testAssist.initialBlogs.length)
})

test('Unique identifer for a blog post is "id"', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body[0].id).toBeDefined()
})

test('Posting a new blog is received in the database', async () => {
  const testBlog = {
    title: 'This title should match the response',
    author: 'Tom A',
    url: 'www.url.com',
    likes: 10
  }

  const postedNote = await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(201)
  expect(postedNote.body.title).toBe(testBlog.title)

  testBlog.id = postedNote.body.id

  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body).toContainEqual(testBlog)
  expect(response.body.length).toBe(testAssist.initialBlogs.length + 1)
})

test('Posting a blog without the likes property defaults the likes value to 0', async () => {
  const testBlog = {
    title: 'This blog has no likes yet',
    author: 'Newbie Nelly',
    url: 'www.qwerty.com'
  }
  const postedBlog = await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(201)
  expect(postedBlog.body.likes).toBe(0)

  testBlog.likes = 0
  testBlog.id = postedBlog.body.id

  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body).toContainEqual(testBlog)
})

test('Posting a blog without a title will not be saved in database', async () => {
  const testBlog = {
    title: 'This blog has no url',
    author: 'Newbie Nelly',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(400)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  const titles = response.body.map(blog => blog.title)
  expect(titles).not.toContain(testBlog.title)
})

test('Posting a blog without a url will not be saved in database', async () => {
  const testBlog = {
    author: 'Newbie Nelly',
    url: 'www.thisbloghasnotitle.com',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(400)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  const urls = response.body.map(blog => blog.url)
  expect(urls).not.toContain(testBlog.url)
})

test('Deleting a blog post removes that blog from the database', async () => {
  const blogsBeforeDeletion = await api
    .get('/api/blogs')
    .expect(200)
  const blogToDelete = blogsBeforeDeletion.body[0]
  const id = blogToDelete.id

  await api
    .delete(`/api/blogs/${id}`)
    .expect(204)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body).not.toContainEqual(blogToDelete)
})

test('Updating the info for a blog post will update it on the database', async () => {
  const testBlog = {
    title: 'This blog will update a previous one',
    author: 'Updater',
    url: 'www.ooo.com',
    likes: 5
  }

  const blogsBeforeUpdate = await api
    .get('/api/blogs')
    .expect(200)
  const blogToUpdate = blogsBeforeUpdate.body[0]
  const id = blogToUpdate.id

  await api
    .put(`/api/blogs/${id}`)
    .send(testBlog)
    .expect(200)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body).not.toContainEqual(blogToUpdate)
  const titles = response.body.map(blog => blog.title)
  expect(titles).toContain(testBlog.title)
})

afterAll(async () => await mongoose.connection.close())