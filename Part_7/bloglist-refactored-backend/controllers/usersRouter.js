const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/user')

usersRouter.get('/api/users', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs')
  response.json(users)
})

usersRouter.post('/api/users', async (request, response) => {
  const { username, password, name } = request.body

  if (!password) {
    return response
      .status(400)
      .json({ error: 'User must have a password' })
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'Password must have at least 3 characters' })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    username: username,
    passwordHash: passwordHash,
    name: name
  })

  const toSend = await newUser.save()
  response.status(201).json(toSend)
})

module.exports = usersRouter