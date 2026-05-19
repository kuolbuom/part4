const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most likes', () => {
   const blogs = [
  { author: "Robert C. Martin", title: "Clean Code",likes: 10 },
  { author: "Robert C. Martin", title: "Clean Architecture",likes: 1  },
  { author: "Edsger Dijkstra", title: "Go To Statement Considered Harmful",likes: 17  },
]

test('author with most lilkes is Edsger Dijkstra', () => {
    const result = listHelper.mostLikes(blogs)

    assert.deepStrictEqual(result, {
      author: "Edsger Dijkstra",
      likes: 17
    })
  })
})