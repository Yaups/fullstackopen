import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setAll(state, action) {
      return action.payload
    },
    addNew(state, action) {
      return state.concat(action.payload)
    },
    removeOne(state, action) {
      const filteredBlogs = state.filter((blog) => blog.id !== action.payload)
      return filteredBlogs
    },
  },
})

export const { setAll, addNew, removeOne } = blogsSlice.actions

export const initialiseBlogs = () => {
  return async (dispatch) => {
    const initialBlogs = await blogService.getAll()
    dispatch(setAll(initialBlogs))
  }
}

export const postBlog = (newBlog) => {
  return async (dispatch) => {
    dispatch(addNew(newBlog))
  }
}

export const upvoteBlog = (id, blogToUpvote) => {
  return async (dispatch, getState) => {
    const updatedBlog = { ...blogToUpvote, likes: blogToUpvote.likes + 1 }

    const upvoteResponse = await blogService.update(id, updatedBlog)

    const blogToAdd = {
      ...upvoteResponse,
      user: {
        name: blogToUpvote.user.name,
        username: blogToUpvote.user.username,
      },
    }

    const blogs = getState().blogs
    const blogsWithOldRemoved = blogs.filter((blog) => blog.id !== id)
    const blogsWithNewUpvote = [...blogsWithOldRemoved, blogToAdd]

    dispatch(setAll(blogsWithNewUpvote))
  }
}

export const postBlogComment = (blog, text) => {
  return async (dispatch, getState) => {
    const blogWithComment = {
      ...blog,
      comments: blog.comments.concat({ text }),
    }

    const commentResponse = await blogService.update(blog.id, blogWithComment)

    const blogToReplace = {
      ...commentResponse,
      user: {
        name: blog.user.name,
        username: blog.user.username,
      },
    }

    const blogs = getState().blogs
    const blogsWithOldRemoved = blogs.filter((b) => b.id !== blogToReplace.id)
    const blogsWithNewComment = [...blogsWithOldRemoved, blogToReplace]

    dispatch(setAll(blogsWithNewComment))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch, getState) => {
    const user = getState().user
    await blogService.remove(id, user.token)
    dispatch(removeOne(id))
  }
}

export default blogsSlice.reducer
