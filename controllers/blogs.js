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

blogRouter.put('/:id', async (request, response) => {
  const body = request.body;

  const blog = {
    likes: body.likes,
  };

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true });
  
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
