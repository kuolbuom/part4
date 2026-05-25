const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const logger = require('../utils/logger')
const config = require('../utils/config')


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

blogsRouter.post('/', async (request, response) => {
  const body = request.body

const decodedToken = jwt.verify(
  request.token,
  config.SECRET,
   // token expires in 60*60 seconds, that is, in one hour
  { expiresIn: 60*60 }
)

if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(decodedToken.id)

 if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
  }

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
blogsRouter.delete('/:id', async (request, response) => {
  //verify token
  const decodedToken = jwt.verify(
  request.token,
  config.SECRET
)

//token missing or invalid
if (!decodedToken.id) {
  return response.status(401).json({
    error: 'token invalid'
  })
}

//find blog
const blog = await Blog.findById(request.params.id)

//compare blog owner with token user or compare creator id with token id
if (blog.user.toString() !== decodedToken.id.toString()) {
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
    { new: true, 
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