const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');

beforeEach(async () => {
  await Blog.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
});

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});

test('a valid blog can be added', async () => {
  const newBlog = {
    title: 'Luminite pe balcon',
    author: 'Andrei Pirvan',
    url: 'https://complementor.dk/',
    likes: 7,
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const titles = blogsAtEnd.map((b) => b.title);
  expect(titles).toContain('Luminite pe balcon');
});

test('default 0 when likes missing from request', async () => {
  const newBlog = {
    title: 'Luminite pe balcon',
    author: 'Andrei Pirvan',
    url: 'https://complementor.dk/',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const likes = blogsAtEnd.map((b) => b.likes);
  console.log(likes);
  likes.forEach(like => {
    expect(like).toBeGreaterThanOrEqual(0);
  });
});

test('blog without url and title is not added', async () => {
  const newBlog = {
    author: 'Andrei Pirvan',
  };

  await api.post('/api/blogs').send(newBlog).expect(404);

  const response = await api.get('/api/blogs');

  expect(response.body).toHaveLength(helper.initialBlogs.length);
});


afterAll(() => {
  mongoose.connection.close();
});
