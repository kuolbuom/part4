const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcryptjs')
const User = require('../models/user')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await user.save()

  const blogObjects = listHelper.initialBlogs
    .map(blog => new Blog(blog))

  const promiseArray = blogObjects.map(blog => blog.save())

  await Promise.all(promiseArray)
})

test('a valid blog can be added', async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({
      username: 'root',
      password: 'sekret'
    })

  const token = loginResponse.body.token

  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'async/await',
    url: 'async.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await listHelper.blogsInDb()

  assert.strictEqual(
    blogsAtEnd.length,
    listHelper.initialBlogs.length + 1
  )
})

test('adding a blog fails with status code 401 if token is not provided', async () => {
  const newBlog = {
    title: 'No token blog',
    author: 'Nobody',
    url: 'notoken.com',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)
})

after(async () => {
  await mongoose.connection.close()
})