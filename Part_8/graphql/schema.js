const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    _id: ID!
  }

  type LoginResponse {
    token: String!
    username: String!
    favoriteGenre: String!
    _id: ID!
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
    ): LoginResponse
  }

  type Subscription {
    bookAdded: Book!
  }    
`

module.exports = typeDefs
