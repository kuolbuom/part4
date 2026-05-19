const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require ('../utils/list_helper')

describe('most blogs', () => {
  const blogs = [
    { author: "Robert C. Martin", title: "Clean Code" },
    { author: "Robert C. Martin", title: "Clean Architecture" },
    { author: "Edsger Dijkstra", title: "Go To Statement Considered Harmful" },
  ]

  test('author with most blogs is Robert C. Martin', () => {
    const result = listHelper.mostBlogs(blogs)

    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 2
    })
  })
})