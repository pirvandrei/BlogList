const blogRouter = require('express').Router();
const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { name: 1, username: 1});

  if (blogs) {
    response.json(blogs);
  } else {
    response.status(404).end();
  }
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;
  
  const decodedToken = jwt.verify(request.token, process.env.secret);

  if (!request.token || !decodedToken.id) {
    return response.status(404).json({ error: 'token missing or invalid' });
  }

  const user = await User.findById(decodedToken.id);

  if (body.url === undefined || body.title === undefined) {
    return response.status(404).json({
      error: 'bad request',
    });
  }

  const newBlog = new Blog({
    name: body.name,
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
  const blog = await Blog.findByIdAndRemove(request.params.id);
  if (blog) {
    response.json(blog);
  } else {
    response.status(404).end;
  }
});

module.exports = blogRouter;
