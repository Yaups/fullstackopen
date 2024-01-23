const supertest = require('supertest')
const testAssist = require('../utils/testAssist')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

beforeEach(async () => await testAssist.insertInitialUsers())

test('Logging in with correct username and password succeeds', async () => {
  const { username, password } = testAssist.initialUsers[0]

  const response = await api
    .post('/api/login')
    .send({ username, password })
    .expect(200)
  expect(response.body.token).toBeDefined()
})

test('Logging in without a username or password does not succeed', async () => {
  const username = testAssist.initialUsers[0].username
  const response1 = await api
    .post('/api/login')
    .send({ username })
    .expect(400)
  expect(response1.body.error).toContain('Please enter a password')
  expect(response1.body.token).not.toBeDefined()

  const password = testAssist.initialUsers[0].password
  const response2 = await api
    .post('/api/login')
    .send({ password })
    .expect(400)
  expect(response2.body.error).toContain('Please enter a username')
  expect(response2.body.token).not.toBeDefined()
})

test('Logging with incorrect password does not succeed', async () => {
  const username = testAssist.initialUsers[0].username
  const password = 'wrongPassword'

  const response = await api
    .post('/api/login')
    .send({ username, password })
    .expect(401)
  expect(response.body.error).toContain('Invalid username or password')
  expect(response.body.token).not.toBeDefined()
})

test('Logging in with incorrect username does not succeed', async () => {
  const username = 'fake user'
  const password = testAssist.initialUsers[0].password

  const response = await api
    .post('/api/login')
    .send({ username, password })
    .expect(401)
  expect(response.body.error).toContain('Invalid username or password')
  expect(response.body.token).not.toBeDefined()
})

afterAll(async () => await mongoose.connection.close())