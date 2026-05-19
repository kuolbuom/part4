const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null

  let favorite = blogs[0]

  blogs.forEach(blog => {
    if (blog.likes > favorite.likes) {
      favorite = blog
    }
  })

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
  }
}

module.exports = {favoriteBlog}