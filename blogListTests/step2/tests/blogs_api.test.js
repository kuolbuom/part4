const { test, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

test('unique identifier property is named id', async () => {
  const response = await api.get('/api/blogs')

  const blog = response.body[0]

  assert(blog.id !== undefined)
  assert.strictEqual(blog._id, undefined)
  assert.strictEqual(blog.__v, undefined)
})

after(async () => {
  await mongoose.connection.close()
})
