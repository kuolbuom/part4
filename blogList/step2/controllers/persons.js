const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then(blog => {
    response.json(blog)
  })
})

blogsRouter.get('/:id', (request, response) => {

  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(logger.error)
})

blogsRouter.post('/', (request, response) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  blog.save().then(savedBlog => {
    response.status(201).json(savedBlog)
  })
    .catch(logger.error)
})

blogsRouter.delete('/:id', (request, response) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(blog => {
      response.status(204).end()
    })
    .catch(logger.error)
})

blogsRouter.put('/:id', (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true, context: 'query' }
  ).then(updatedBlog => {
    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  })
})
module.exports = blogsRouter