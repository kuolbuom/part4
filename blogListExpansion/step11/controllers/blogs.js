const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const config = require('../utils/config')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', {
      username: 1,
      name: 1
    })
  response.json(blogs)
})

blogsRouter.get('/:id', async (request, response) => {

  const blog = await Blog.findById(request.params.id)

  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post(
  '/',
  middleware.userExtractor,
  async (request, response) => {

    const body = request.body

    const user = request.user

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)

    await user.save()

    response.status(201).json(savedBlog)
  })

//protect delete route with token
blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {

    const user = request.user

    //find blog
    const blog = await Blog.findById(request.params.id)
     //checking whether there is no blog
        if (!blog) {
      return response.status(404).json({
        error: 'blog not found'
      })
    }

    //compare blog owner with token user or compare creator id with token id
    if (blog.user.toString() !== user.id.toString()) {
      return response.status(401).json({
        error: 'only creator can delete a blog'
      })
    }

    //delete blog
    await Blog.findByIdAndDelete(request.params.id)

    response.status(204).end()
  })

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    {
      new: true,
      runValidators: true,
      context: 'query'
    }
  )

  if (updatedBlog) {
    response.json(updatedBlog)
  } else {
    response.status(404).end()
  }
})
module.exports = blogsRouter