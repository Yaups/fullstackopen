const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

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
  Book: {
    author: (root) => {
      return {
        name: root.author.name,
        id: root.author._id,
        born: root.author.born,
        bookCount: root.author.bookCount,
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

      return {
        ...user.toObject(),
        token: jwt.sign(toEncode, process.env.JWT_SECRET),
      }
    },
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('You must be logged in to add a book!', {
          extensions: { code: 'BAD_USER_INPUT' },
        })
      }

      const authors = await Author.find({})
      const authorNames = authors.map((author) => author.name)

      try {
        if (!authorNames.includes(args.author)) {
          const newAuthor = new Author({ name: args.author, bookCount: 1 })
          await newAuthor.save()
        } else {
          const authorToIncrement = await Author.findOne({ name: args.author })
          const authorObj = authorToIncrement.toObject()
          const updatedAuthor = {
            ...authorObj,
            bookCount: authorObj.bookCount + 1,
          }
          const toSave = new Author(updatedAuthor)

          await Author.findByIdAndDelete(authorToIncrement._id)
          await toSave.save()
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
        await book.save()
        const toReturn = await book.populate('author')
        pubsub.publish('BOOK_ADDED', { bookAdded: toReturn })
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
  Subscription: {
    bookAdded: { subscribe: () => pubsub.asyncIterator('BOOK_ADDED') },
  },
}

module.exports = resolvers
