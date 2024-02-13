import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      genres
      _id
      author {
        name
      }
    }
  }
`
export const BOOKS_BY_GENRE = gql`
  query booksByGenre($filterGenre: String) {
    allBooks(genre: $filterGenre) {
      title
      published
      genres
      _id
      author {
        name
      }
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      bookCount
      _id
    }
  }
`

export const ME = gql`
  query {
    me {
      username
      favoriteGenre
      _id
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      _id
      author {
        name
      }
      genres
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation modifyAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      bookCount
      _id
    }
  }
`

export const LOG_IN = gql`
  mutation log_in($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      username
      favoriteGenre
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      genres
      _id
      author {
        name
      }
    }
  }
`
