const blogRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1 });

  response.json(blogs);
  
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;

  const decodedToken = jwt.verify(request.token, process.env.secret);

  if (!request.token || !decodedToken.id) {
    return response.status(404).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response
      .status(404)
      .json({ error: 'blog has no user with this token' + decodedToken.id });
  }

  if (body.url === undefined || body.title === undefined) {
    return response.status(404).json({
      error: 'bad request',
    });
  }

  const newBlog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  });

  const savedBlog = await newBlog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog);
});

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
    new: true,
  });

  response.json(updatedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    return response.status(404).json({ error: 'can not find the blog' });
  }

  // const token = getTokenFrom(request);
  const decodedToken = jwt.verify(request.token, process.env.SECRET);

  if (!request.token || !decodedToken.id) {
    return response.status(404).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (!user) {
    return response.status(404).json({ error: 'can not find the user' });
  }

  if (blog.user.toString() === user._id.toString()) {
    const blogRemoved = await Blog.findByIdAndRemove(blog.id);
    response.json(blogRemoved);
  } else {
    return response.status(401).json({ error: 'unauthorized access' });
  }
});

module.exports = blogRouter;
