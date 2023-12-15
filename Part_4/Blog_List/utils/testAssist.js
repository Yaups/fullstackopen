const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'First Test',
    author: 'James Brown',
    url: 'www.firsttest.com',
    likes: 34
  },
  {
    title: 'Second Test',
    author: 'Will Bade',
    url: 'www.secondtest.com',
    likes: 17
  },
  {
    title: 'Third Test',
    author: 'Richard Aloe',
    url: 'www.thirdtest.com',
    likes: 20
  },
  {
    title: 'Fourth Test',
    author: 'Gemma Watkins',
    url: 'www.fourthtest.com',
    likes: 8
  }
]

const initialUsers = [
  {
    username: 'First Test',
    passwordHash: '$2b$10$PZOKsRER6SO3dH2vz5Mgtuq7aqdBF.puFecFIViiP84YXLPrJQEAu',
    name: 'First'
  },
  {
    username: 'Second Test',
    passwordHash: '$2b$10$PZOKsRER6SO3dH2vz5Mgtuq7aqdBF.puFecFIViiP84YXLPrJQEAu',
    name: 'Second'
  },
  {
    username: 'Third Test',
    passwordHash: '$2b$10$PZOKsRER6SO3dH2vz5Mgtuq7aqdBF.puFecFIViiP84YXLPrJQEAu',
    name: 'Third'
  }
]

const findUserId = async (username) => {
  const user = await User.find({ username })
  return user.id
}

const findBlogId = async (title) => {
  const blog = await Blog.find({ title })
  return blog.id
}

module.exports = { initialBlogs, initialUsers, findUserId, findBlogId }