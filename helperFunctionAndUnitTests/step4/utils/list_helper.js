const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null

  const authorCount = {}

  blogs.forEach(blog => {
    const author = blog.author

    if (authorCount[author]) {
      authorCount[author] += 1
    } else {
      authorCount[author] = 1
    }
  })

  let maxAuthor = null
  let maxBlogs = 0

  for (let author in authorCount) {
    if (authorCount[author] > maxBlogs) {
      maxBlogs = authorCount[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    blogs: maxBlogs
  }
}

module.exports = { mostBlogs }