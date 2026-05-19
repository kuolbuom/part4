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


test('if likes property is missing, it defaults to 0', async () => {
  const newBlog = {
    title: 'No likes blog',
    author: 'Unknown',
    url: 'nolikes.com'
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await listHelper.blogsInDb()

  const addedBlog = blogsAtEnd.find(
    blog => blog.title === 'No likes blog'
  )

  assert.strictEqual(addedBlog.likes, 0)
})

after(async () => {
  await mongoose.connection.close()
})