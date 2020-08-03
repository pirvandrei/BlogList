const blogRouter = require('express').Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});

  if (blogs) {
    response.json(blogs);
  } else {
    response.status(404).end();
  }
});

blogRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.url === undefined || body.title === undefined) {
    return response.status(404).json({
      error: 'bad request',
    });
  }
  
  const newBlog = new Blog({
    name: body.name,
    title: body.title,
    url: body.url,
    likes: body.likes || 0
  });

  const savedBlog = await newBlog.save();
  response.json(savedBlog);
});

module.exports = blogRouter;
