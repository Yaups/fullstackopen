const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const initialBlogs = [
  {
    title: 'This blog belongs to James Brown',
    author: 'James Brown',
    url: 'www.firsttest.com',
    likes: 34
  },
  {
    title: 'This blog belongs to Will Bade',
    author: 'Will Bade',
    url: 'www.secondtest.com',
    likes: 17
  },
  {
    title: 'This blog belongs to Gemma Watkins',
    author: 'Gemma Watkins',
    url: 'www.fourthtest.com',
    likes: 8
  }
]

const initialUsers = [
  {
    username: 'JamesBrown',
    password: 'utensil',
    name: 'James Brown'
  },
  {
    username: 'WillBade',
    password: 'flask',
    name: 'Will Bade'
  },
  {
    username: 'GemmaWatkins',
    password: 'splinter',
    name: 'Gemma Watkins'
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

const insertInitialUsers = async () => {
  await User.deleteMany({})

  const promises = initialUsers.map(user =>
    bcrypt.hash(user.password, 10)
  )

  const passwordHashes = await Promise.all(promises)

  const usersToAdd = []
  for (let i = 0; i < passwordHashes.length; i++) {
    usersToAdd[i] = {
      username: initialUsers[i].username,
      passwordHash: passwordHashes[i],
      name: initialUsers[i].name
    }
  }

  return User.insertMany(usersToAdd)
}

const insertAllBlogsAndUsers = async () => {
  //This function posts x blogs and x users as long as initialBlogs and initialUsers have the same number of entries.
  //The first blog is always owned by the first user, the second blog is always owned by the second user, and so on.

  if (initialBlogs.length !== initialUsers.length) {
    console.error('Initial blogs and initial users arrays must match in length')
    process.exit(0)
  }

  //Post all users and get their ids
  const postedUsers = await insertInitialUsers()
  const userIds = postedUsers.map(u => u._id)

  //Assign one user id to each blog
  const blogsToInsert = initialBlogs
  for (let i = 0; i < blogsToInsert.length; i++) {
    blogsToInsert[i].user = userIds[i]
  }

  //Post all blogs and get their ids
  await Blog.deleteMany({})
  const postedBlogs = await Blog.insertMany(blogsToInsert)
  const blogIds = postedBlogs.map(b => b._id)

  //Update each user to contain their blog id
  const usersToUpdate = postedUsers
  for (let i = 0; i < blogsToInsert.length; i++) {
    usersToUpdate[i].blogs = usersToUpdate[i].blogs.concat(blogIds[i])
  }

  await User.deleteMany({})
  await User.insertMany(usersToUpdate)
}

module.exports = {
  initialBlogs,
  initialUsers,
  findUserId,
  findBlogId,
  insertInitialUsers,
  insertAllBlogsAndUsers
}