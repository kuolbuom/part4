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


test('a valid blog can be added ', async () => {

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'async/await',
    url: 'async/await.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  assert.strictEqual(response.body.length, listHelper.initialBlogs.length + 1)

  assert(titles.includes('async/await simplifies making async calls'))
})


after(async () => {
  await mongoose.connection.close()
})