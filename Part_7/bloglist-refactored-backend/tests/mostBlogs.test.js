const listHelper = require('../utils/list_helper')


describe('The author with the most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    }
  ]

  test('for an array containing one blog is the one author in the array.', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual(
      {
        author: 'Edsger W. Dijkstra',
        blogs: 1
      }
    )
  })

  const emptyArray = []

  test('for an empty array is null', () => {
    const result = listHelper.mostBlogs(emptyArray)
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
      author: 'Bloggy Ben',
      url: 'http://www.hello.com',
      likes: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Testblog 3',
      author: 'Bloggy Ben',
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
      author: 'Bloggy Ben',
      url: 'http://www.night.com',
      likes: 6
    }
  ]

  test('for an array of multiple blogs is the author with the most blogs.', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual(
      {
        author: 'Bloggy Ben',
        blogs: 3
      }
    )
  })

})