const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
//const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const author = require('./models/author')
require('dotenv').config()

mongoose.set('strictQuery', false)

const MONGODB_URI = process.env.MONGODB_URI
console.log('Attempting to connect to MongoDB @ ', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const typeDefs = `
  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }

  type Query {
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
  }
`

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    /*allBooksOld: (root, args) => {
      const byAuthor = args.author
        ? (book) => book.author === args.author
        : (book) => book
      const byGenre = args.genre
        ? (book) => book.genres.includes(args.genre)
        : (book) => book
      return books.filter(byAuthor).filter(byGenre)
    },
    */
    allBooks: (root, args) => {
      return Book.find({})
    },
    allAuthors: async () => Author.find({}),
    authorCount: async () => Book.collection.countDocuments(),
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
  Mutation: {
    /*
    addBookOld: async (root, args) => {
      const book = { ...args, id: uuid() }
      books = books.concat(book)

      const authorNames = authors.map((author) => author.name)
      if (!authorNames.includes(args.author))
        authors.push({ name: args.author, id: uuid() })

      return book
    },
    */
    addBook: async (root, args) => {
      const authors = await Author.find({})

      const authorNames = authors.map((author) => author.name)

      if (!authorNames.includes(args.author)) {
        const newAuthor = new Author({ name: args.author })
        await newAuthor.save()
      }

      const author = await Author.findOne({ name: args.author })
      console.log(author)
      const book = new Book({ ...args, author: author._id })
      console.log(book)
      return book.save()
    },
    /*
    editAuthor: (root, args) => {
      const author = authors.find((a) => a.name === args.name)
      if (!author) {
        return null
      }

      const updatedAuthor = { ...author, born: args.setBornTo }
      authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a))
      return updatedAuthor
    },
    */
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
