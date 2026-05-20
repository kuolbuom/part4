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


test('a blog likes can be updated', async () => {
  const blogsAtStart = await listHelper.blogsInDb()

  const blogToUpdate = blogsAtStart[0]

  const updatedBlog = {
    ...blogToUpdate,
    likes: 100
  }

  const response = await api
    .put(`/api/blogs/${blogToUpdate.id}`)
    .send(updatedBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, 100)

  const blogsAtEnd = await listHelper.blogsInDb()

  const changedBlog = blogsAtEnd.find(
    blog => blog.id === blogToUpdate.id
  )

  assert.strictEqual(changedBlog.likes, 100)
})

after(async () => {
  await mongoose.connection.close()
})