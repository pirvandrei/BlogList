const dummy = (blogs) => {
  return blogs.length === 0 ? 1 : blogs.length;
};

const totalLikes = (blogs) => {
  return blogs.reduce(
    (accumulator, currentValue) => (accumulator += currentValue.likes),
    0
  );
};

const favoriteBlog = (blogs) => {
  // sort descending by value
  blogs.sort(function (a, b) {
    return b.likes - a.likes;
  });

  return {
    title: blogs[0].title,
    author: blogs[0].author,
    likes: blogs[0].likes,
  };
};


const mostLikes = (blogs) => {
  const reducer = (authorLikesAccumulator, currentBlog) => {
    if (currentBlog.author in authorLikesAccumulator) {
      authorLikesAccumulator[currentBlog.author] += currentBlog.likes;
    } else {
      authorLikesAccumulator[currentBlog.author] = currentBlog.likes;
    }

    return authorLikesAccumulator;
  };

  const authorsLikes = blogs.reduce(reducer, {});

  var max = -Infinity;
  var name = '';
  var likesNumber = 0;

  for (var author in authorsLikes) {
    if (authorsLikes[author] > max) {
      max = authorsLikes[author];
      name = author;
      likesNumber = authorsLikes[author];
    }
  }

  return { 'author': name, 'likes': likesNumber };
};

const mostBlogs = (blogs) => {
  const reducer = (authorAccumulator, currentBlog) => {
    if (currentBlog.author in authorAccumulator) {
      authorAccumulator[currentBlog.author]++;
    } else {
      authorAccumulator[currentBlog.author] = 1;
    }

    return authorAccumulator;
  };

  const authors = blogs.reduce(reducer, {});

  var max = -Infinity;
  var name = '';
  var blogNr = 0;

  for (var author in authors) {
    if (authors[author] > max) {
      max = authors[author];
      name = author;
      blogNr = authors[author];
    }
  }

  return { 'author': name, 'blogs': blogNr };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
