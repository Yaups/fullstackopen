import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('<Blog /> renders only required content initially', () => {
  const blog = {
    title: 'This is a new blog for the unit test sl2046h3nv02',
    author: 'Author for unit test sl2046h3nv02',
    url: 'www.sl2046h3nv02.com',
    likes: 0,
  }

  const user = {
    name: 'Test Name sl2046h3nv02',
  }

  render(
    <Blog
      blog={blog}
      user={user}
      handleDeletion={() => null}
      handleUpvote={() => null}
    />,
  )

  const titleAndAuthor = screen.getByText(`${blog.title} - ${blog.author}`)
  const likes = screen.queryByText(`Likes: ${blog.likes}`)
  const url = screen.queryByText(blog.url)
  const postedBy = screen.queryByText(`Posted by ${user.name}`)

  expect(titleAndAuthor).toBeDefined()
  expect(likes).toBeNull()
  expect(url).toBeNull()
  expect(postedBy).toBeNull()
})

test('Additional info is shown after the button is clicked', async () => {
  const blog = {
    title: 'This is a new blog for the unit test 436e5ryu23',
    author: 'Author for unit test 436e5ryu23',
    url: 'www.436e5ryu23.com',
    likes: 0,
    user: {
      name: 'Test Name 436e5ryu23',
    },
  }

  const user = {
    name: blog.user.name,
  }

  render(
    <Blog
      blog={blog}
      user={user}
      handleDeletion={() => null}
      handleUpvote={() => null}
    />,
  )

  const clicker = userEvent.setup()
  const button = screen.getByText('Show')
  await clicker.click(button)

  const titleAndAuthor = screen.getByText(`${blog.title} - ${blog.author}`)
  const likes = screen.getByText(`Likes: ${blog.likes}`, { exact: false })
  const url = screen.getByText(blog.url, { exact: false })
  const postedBy = screen.getByText(`Posted by ${user.name}`, { exact: false })
})

test('Clicking the like button twice calls its event handler twice', async () => {
  const blog = {
    title: 'This is a new blog for the unit test 387hfhu83',
    author: 'Author for unit test 387hfhu83',
    url: 'www.387hfhu83.com',
    likes: 0,
    user: {
      name: 'Test Name 387hfhu83',
    },
  }

  const user = {
    name: blog.user.name,
  }

  const mockHandler = jest.fn()

  render(
    <Blog
      blog={blog}
      user={user}
      handleDeletion={() => null}
      handleUpvote={mockHandler}
    />,
  )

  const clicker = userEvent.setup()
  const showButton = screen.getByText('Show')
  await clicker.click(showButton)

  const likeButton = screen.getByText('Like')
  await clicker.click(likeButton)
  await clicker.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
