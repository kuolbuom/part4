const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const listHelper = require('../utils/list_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})

  console.log('cleared')

  await Blog.insertMany(listHelper.initialBlogs)
  console.log('done')
})


 test('a blog can be deleted', async () => {
    const blogsAtStart = await listHelper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    console.log('Blog to Delete', blogToDelete)

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await listHelper.blogsInDb()

    const ids = blogsAtEnd.map(n => n.id)

    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(
      blogsAtEnd.length,
      listHelper.initialBlogs.length - 1
    )
  })

after(async () => {
  await mongoose.connection.close()
})