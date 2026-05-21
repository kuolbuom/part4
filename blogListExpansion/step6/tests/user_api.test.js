const mongoose = require('mongoose')
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const bcrypt = require('bcryptjs')
const supertest = require('supertest')

const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)

  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash
  })

  await user.save()
})

test('creation succeeds with a fresh username', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    password: 'salainen'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

  const usernames = usersAtEnd.map(u => u.username)

  assert(usernames.includes('mluukkai'))
})

test('creation fails if username already exists', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'root',
    name: 'Another Root',
    password: 'salainen'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes('expected `username` to be unique'))

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails if password is too short', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'newuser',
    name: 'Test User',
    password: '12'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes(
    'password must be at least 3 characters long'
  ))

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

test('creation fails if username is too short', async () => {
  const usersAtStart = await User.find({})

  const newUser = {
    username: 'ab',
    name: 'Short Name',
    password: 'validpassword'
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)

  assert(result.body.error.includes(
    'shorter than the minimum allowed length'
  ))

  const usersAtEnd = await User.find({})

  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
})