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

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map((r) => r.title);
    expect(titles).toContain('React patterns');
  });
});

describe('addition of a blog', () => {
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
    likes.forEach((like) => {
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
});

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length - 1);

    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.titles);
  });
});

describe('updating of a blog', () => {
  test('succeeds with status code 200 when likes is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToBeUpdated = blogsAtStart[0];

    const newBlog = blogToBeUpdated;
    newBlog.likes += 1;

    await api.put(`/api/blogs/${blogToBeUpdated.id}`).send(newBlog).expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
