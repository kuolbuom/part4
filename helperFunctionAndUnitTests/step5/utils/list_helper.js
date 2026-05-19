const mostLikes = (blogs) => {
  if (blogs.length === 0) return null

  const likesCount = {}

  blogs.forEach(blog => {
    const author = blog.author

    if (likesCount[author]) {
      likesCount[author] += blog.likes
    } else {
      likesCount[author] = blog.likes
    }
  })

  let maxAuthor = null
  let maxLikes = 0

  for (let author in likesCount) {
    if (likesCount[author] > maxLikes) {
      maxLikes = likesCount[author]
      maxAuthor = author
    }
  }

  return {
    author: maxAuthor,
    likes: maxLikes
  }
}

module.exports = { mostLikes }
