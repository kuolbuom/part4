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


/  test('blog without title or url is not added', async () => {
    const newBlog = {
      title: 'yes',
      author: 'none'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    // const response = await api.get('/api/blogs')
    const blogsAtEnd = await helper.blogsInDb()

    assert.strictEqual(blogsAtEnd.body.length, listHelper.initialBlogs.length)
  })

after(async () => {
  await mongoose.connection.close()
})