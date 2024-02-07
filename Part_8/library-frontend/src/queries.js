import { gql } from '@apollo/client'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
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
      _id
    }
  }
`
//bookCount in ALL_AUTHORS

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
      _id
    }
  }
`
//bookCount in UPDATE_AUTHOR

export const LOG_IN = gql`
  mutation log_in($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
