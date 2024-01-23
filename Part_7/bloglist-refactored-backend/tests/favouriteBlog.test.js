const listHelper = require('../utils/list_helper')


describe('The blog with the most likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }
  ]

  test('for an array containing one blog is the one blog in the array.', () => {
    const result = listHelper.favouriteBlog(listWithOneBlog)
    expect(result).toEqual(
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      }
    )
  })

  const emptyArray = []

  test('for an empty array is null', () => {
    const result = listHelper.favouriteBlog(emptyArray)
    expect(result).toBe(null)
  })

  const listWithMultipleBlogs = [
    {
      _id: '5a422aad1b54a176234d17f8',
      title: 'Testblog 1',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.hi.com',
      likes: 2
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Testblog 2',
      author: '2343424',
      url: 'http://www.hello.com',
      likes: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Testblog 3',
      author: 'aasdasd',
      url: 'http://www.goodbye.com',
      likes: 17
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Testblog 4',
      author: 'dfdf',
      url: 'http://www.day.com',
      likes: 4
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Testblog 5',
      author: 'saddas',
      url: 'http://www.night.com',
      likes: 6
    }
  ]

  test('for an array of multiple blogs is the blog with the most likes.', () => {
    const result = listHelper.favouriteBlog(listWithMultipleBlogs)
    expect(result).toEqual(
      {
        title: 'Testblog 3',
        author: 'aasdasd',
        likes: 17
      }
    )
  })

})