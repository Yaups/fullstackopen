const supertest = require('supertest')
const testAssist = require('../utils/testAssist')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => await testAssist.insertAllBlogsAndUsers())

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

test('Posting a new blog with an auth token is received in the database', async () => {
  const testBlog = {
    title: 'This title should match the response',
    author: 'Tom A',
    url: 'www.url.com',
    likes: 10
  }

  const { username, password } = testAssist.initialUsers[0]
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  const authToken = loginResponse.body.token

  const postedNote = await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${authToken}` })
    .send(testBlog)
    .expect(201)
  expect(postedNote.body.title).toBe(testBlog.title)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  const titles = response.body.map(b => b.title)
  expect(titles).toContain(testBlog.title)
  expect(response.body.length).toBe(testAssist.initialBlogs.length + 1)
})

test('Posting a blog without an auth token will not work', async () => {
  const testBlog = {
    title: 'This title should match the response',
    author: 'Tom A',
    url: 'www.url.com',
    likes: 10
  }

  const failedPost = await api
    .post('/api/blogs')
    .send(testBlog)
    .expect(401)
  expect(failedPost.body.error).toContain('No auth token: It appears that you are not logged in.')

  const response = await api
    .get('/api/blogs')
    .expect(200)
  const titles = response.body.map(b => b.title)
  expect(titles).not.toContain(testBlog.title)
  expect(response.body.length).toBe(testAssist.initialBlogs.length)
})

test('Posting a blog without the likes property defaults the likes value to 0', async () => {
  const testBlog = {
    title: 'This blog has no likes yet',
    author: 'Newbie Nelly',
    url: 'www.qwerty.com'
  }

  const { username, password } = testAssist.initialUsers[0]
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  const authToken = loginResponse.body.token

  const postedBlog = await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${authToken}` })
    .send(testBlog)
    .expect(201)
  const postedBlogId = postedBlog.body.id
  expect(postedBlog.body.title).toBe(testBlog.title)
  expect(postedBlog.body.likes).toBe(0)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  const titles = response.body.map(b => b.title)
  expect(titles).toContain(testBlog.title)
  expect(response.body.length).toBe(testAssist.initialBlogs.length + 1)

  const blogToCompare = await Blog.findById(postedBlogId)
  expect(blogToCompare.likes).toBe(0)
})

test('Posting a blog without a url will not be saved in database', async () => {
  const testBlog = {
    title: 'This blog has no url',
    author: 'Newbie Nelly',
    likes: 2
  }

  const { username, password } = testAssist.initialUsers[0]
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  const authToken = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${authToken}` })
    .send(testBlog)
    .expect(400)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  const titles = response.body.map(b => b.title)
  expect(titles).not.toContain(testBlog.title)
  expect(response.body.length).toBe(testAssist.initialBlogs.length)
})

test('Posting a blog without a title will not be saved in database', async () => {
  const testBlog = {
    author: 'Newbie Nelly',
    url: 'www.thisbloghasnotitle.com',
    likes: 1
  }

  const { username, password } = testAssist.initialUsers[0]
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  const authToken = loginResponse.body.token

  await api
    .post('/api/blogs')
    .set({ Authorization: `bearer ${authToken}` })
    .send(testBlog)
    .expect(400)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  const titles = response.body.map(b => b.title)
  expect(titles).not.toContain(testBlog.title)
  expect(response.body.length).toBe(testAssist.initialBlogs.length)
})

test('Deleting a blog with the owner token succeeds', async () => {
  const blogsBeforeDeletion = await api
    .get('/api/blogs')
    .expect(200)
  const blogToDelete = blogsBeforeDeletion.body[0]
  const id = blogToDelete.id

  //The first blog is owned by the first user, so let's log in to the first user and collect the token.
  const { username, password } = testAssist.initialUsers[0]
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  const authToken = loginResponse.body.token

  //Send this token to prove we are the owner of the blog and the deletion should complete successfully.
  await api
    .delete(`/api/blogs/${id}`)
    .set({ Authorization: `bearer ${authToken}` })
    .expect(204)

  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body).not.toContainEqual(blogToDelete)
})

test('Deleting a blog without the owner token fails', async () => {
  const blogsBeforeDeletion = await api
    .get('/api/blogs')
    .expect(200)
  const blogToDelete = blogsBeforeDeletion.body[0]
  const id = blogToDelete.id

  //The first blog is owned by the first user, so let's log in to the second user because we want this to fail.
  const { username, password } = testAssist.initialUsers[1]
  const loginResponse = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  const authToken = loginResponse.body.token

  //Send incorrect token and deletion should not pass
  const errorResponse = await api
    .delete(`/api/blogs/${id}`)
    .set({ Authorization: `bearer ${authToken}` })
    .expect(401)
  expect(errorResponse.body.error).toContain('You are not the owner of this blog!')

  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body).toContainEqual(blogToDelete)
})

test('Deleting a blog without an auth token will not work', async () => {
  const blogsBeforeDeletion = await api
    .get('/api/blogs')
    .expect(200)
  const blogToDelete = blogsBeforeDeletion.body[0]
  const id = blogToDelete.id

  const errorResponse = await api
    .delete(`/api/blogs/${id}`)
    .expect(401)
  expect(errorResponse.body.error).toContain('No auth token: It appears that you are not logged in.')

  const response = await api
    .get('/api/blogs')
    .expect(200)
  expect(response.body).toContainEqual(blogToDelete)
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