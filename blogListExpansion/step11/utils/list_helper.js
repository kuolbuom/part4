const Blog = require('../models/blog')

const initialBlogs = [
  {
    title: 'HTML is easy',
    author: 'HTML',
    url: 'HTML.com',
    likes: 20
  },
  {
    title: 'CSS is hard',
    author: 'CSS',
    url: 'CSS.com',
    likes: 50
  },
  {
    title: 'React is some how easy library',
    author: 'React',
    url: 'React.com',
    likes: 50
  }
]
// can be used for creating a database object ID that does not belong to any blog object in the database.
const nonExistingId = async () => {
  const blog = new Blog({title: 'willremovethissoon'})
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}
//sed for checking the notes stored in the database.
const blogsInDb = async () => {
  const blog = await Blog.find({})
  return blog.map(b => b.toJSON())
}

module.exports = {
initialBlogs, nonExistingId, blogsInDb
}