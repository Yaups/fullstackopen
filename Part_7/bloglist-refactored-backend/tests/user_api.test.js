const supertest = require('supertest')
const testAssist = require('../utils/testAssist')
const mongoose = require('mongoose')
const app = require('../app')
const api = supertest(app)

describe('Adding a user', () => {
  beforeEach(async () => await testAssist.insertInitialUsers())

  test('with correct credentials is saved to the database.', async () => {
    const newUserWithName = {
      username: 'CorrectUsername',
      password: 'pippin',
      name: 'Ron'
    }

    const newUserWithoutName = {
      username: 'AnotherCorrectUsername',
      password: 'beetle',
    }

    const response1 = await api
      .post('/api/users')
      .send(newUserWithName)
      .expect(201)
    const matchingUser1 = {
      username: newUserWithName.username,
      name: newUserWithName.name,
      id: response1.body.id,
      blogs: []
    }

    const response2 = await api
      .post('/api/users')
      .send(newUserWithoutName)
      .expect(201)
    const matchingUser2 = {
      username: newUserWithoutName.username,
      id: response2.body.id,
      blogs: []
    }

    const usersInDb = await api
      .get('/api/users')
      .expect(200)
    expect(usersInDb.body).toContainEqual(matchingUser1)
    expect(usersInDb.body).toContainEqual(matchingUser2)
  })

  test('Without a username is not saved to the database', async () => {
    const newUser = {
      password: 'heya',
      name: 'Ron'
    }

    const unsuccessfulAttempt = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(unsuccessfulAttempt.body.error)
      .toContain('Path `username` is required.')

    const usersInDb = await api
      .get('/api/users')
      .expect(200)
    expect(usersInDb.body.length).toBe(testAssist.initialUsers.length)
    const names = usersInDb.body.map(user => user.name)
    expect(names).not.toContain(newUser.name)
  })

  test('Without a password is not saved to the database', async () => {
    const newUser = {
      username: 'No Password',
      name: 'Ron'
    }

    const unsuccessfulAttempt = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(unsuccessfulAttempt.body.error)
      .toContain('User must have a password')

    const usersInDb = await api
      .get('/api/users')
      .expect(200)
    expect(usersInDb.body.length).toBe(testAssist.initialUsers.length)
    const names = usersInDb.body.map(user => user.name)
    expect(names).not.toContain(newUser.name)
  })

  test('with an already existing username is not saved to the database', async () => {
    const newUser = {
      username: testAssist.initialUsers[0].username,
      password: 'biggie smallz',
      name: 'This object has a duplicate username and will not be saved'
    }

    const unsuccessfulAttempt = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(unsuccessfulAttempt.body.error)
      .toContain('Username already exists')

    const usersInDb = await api
      .get('/api/users')
      .expect(200)
    expect(usersInDb.body.length).toBe(testAssist.initialUsers.length)
    const names = usersInDb.body.map(user => user.name)
    expect(names).not.toContain(newUser.name)
  })

  test('With a username of less than 3 characters is not saved to the database', async () => {
    const newUser = {
      username: 'oi',
      password: 'biggie smallz',
      name: 'Ron'
    }

    const unsuccessfulAttempt = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(unsuccessfulAttempt.body.error)
      .toContain('shorter than the minimum allowed length (3)')

    const usersInDb = await api
      .get('/api/users')
      .expect(200)
    expect(usersInDb.body.length).toBe(testAssist.initialUsers.length)
    const names = usersInDb.body.map(user => user.name)
    expect(names).not.toContain(newUser.name)
  })

  test('With a password of less than 3 characters is not saved to the database', async () => {
    const newUser = {
      username: 'Steveno',
      password: 'y',
      name: 'Steven'
    }

    const unsuccessfulAttempt = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
    expect(unsuccessfulAttempt.body.error)
      .toContain('Password must have at least 3 characters')

    const usersInDb = await api
      .get('/api/users')
      .expect(200)
    expect(usersInDb.body.length).toBe(testAssist.initialUsers.length)
    const names = usersInDb.body.map(user => user.name)
    expect(names).not.toContain(newUser.name)
  })

  afterAll(async () => await mongoose.connection.close())
})