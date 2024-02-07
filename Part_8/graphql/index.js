const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
require('dotenv').config()

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI
console.log('Attempting to connect to MongoDB')

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    _id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    _id: ID!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    _id: ID!
  }

  type Query {
    me: User
    bookCount: Int!,
    authorCount: Int!
    allBooks(
      author: String
      genre: String
      ): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }
`

const resolvers = {
  Query: {
    me: (root, args, { currentUser }) => currentUser,
    bookCount: async () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const byGenre = args.genre ? { genres: args.genre } : {}
      const response = await Book.find(byGenre).populate('author')
      return response
    },
    allAuthors: async () => Author.find({}),
    authorCount: async () => Author.collection.countDocuments(),
  },
  Author: {
    /*
    bookCount: (root) => {
      let count = 0
      books.forEach((book) => {
        if (book.author === root.name) count++
      })
      return count
    },
    */
  },
  Book: {
    author: (root) => {
      return {
        name: root.author.name,
        id: root.author._id,
        born: root.author.born,
        //bookCount: root.author.bookCount???
      }
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({ ...args })
      try {
        return user.save()
      } catch (error) {
        throw new GraphQLError('Creating user failed.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            error,
          },
        })
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'yo yo yo') {
        throw new GraphQLError('Invalid username or password', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const toEncode = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(toEncode, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, { currentUser }) => {
      console.log('request to add book received')

      if (!currentUser) {
        throw new GraphQLError('You must be logged in to add a book!', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const authors = await Author.find({})
      const authorNames = authors.map((author) => author.name)

      try {
        if (!authorNames.includes(args.author)) {
          const newAuthor = new Author({ name: args.author })
          await newAuthor.save()
        }
      } catch (error) {
        throw new GraphQLError('Saving author failed.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
            error,
          },
        })
      }

      const author = await Author.findOne({ name: args.author })

      try {
        const book = new Book({ ...args, author: author._id })
        console.log(book)
        await book.save()
        const toReturn = await book.populate('author')
        return toReturn
      } catch (error) {
        throw new GraphQLError('Saving book failed.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('You must be logged in to edit an author!', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const author = await Author.findOne({ name: args.name })
      if (!author) {
        return null
      }

      const authorObj = author.toObject()
      const updatedAuthor = { ...authorObj, born: args.setBornTo }
      const toSave = new Author(updatedAuthor)

      try {
        await Author.findByIdAndDelete(updatedAuthor._id)
        await toSave.save()
      } catch (error) {
        throw new GraphQLError('Updating author failed.', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: author.name,
            error,
          },
        })
      }

      return updatedAuthor
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },

  context: async ({ req, res }) => {
    const hasBearerHeader = (input) => {
      return input.startsWith('Bearer ') || input.startsWith('bearer ')
    }

    const auth = req ? req.headers.authorization : null
    if (auth && hasBearerHeader(auth)) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
