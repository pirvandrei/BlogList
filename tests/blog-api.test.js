const supertest = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const api = supertest(app);
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
  const promiseArray = blogObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);

  const userObjects = helper.initialUsers.map((user) => new User(user));
  const promiseArrayOfUsers = userObjects.map((user) => user.save());
  await Promise.all(promiseArrayOfUsers);
});

const auth =
  'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBpcnZhbmRyZWkiLCJpZCI6IjVmMjkxODRlYzA3NjI0NTRiOGJlNzMxMiIsImlhdCI6MTU5NjYzOTk4Nn0.NuXVmI27DFxygf3eKwnn7O6HCUJhuhS-L6Eec9FCouY';

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .set({ 'authorization': auth, Accept: 'application/json' })
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api
      .get('/api/blogs')
      .set({ 'authorization': auth, Accept: 'application/json' });

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });

  test('a specific blog is within the returned blogs', async () => {
    const response = await api
      .get('/api/blogs')
      .set({ 'authorization': auth, Accept: 'application/json' });

    const titles = response.body.map((r) => r.title);
    expect(titles).toContain('React patterns');
  });
});

describe('addition of a blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = new Blog({
      title: 'Luminite pe balcon',
      author: 'Andrei Pirvan',
      url: 'https://complementor.dk/',
      likes: 7,
    });

    await api
      .post('/api/blogs')
      .set({ 'authorization': auth, Accept: 'application/json' })
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((b) => b.title);
    expect(titles).toContain('Luminite pe balcon');
  });

  test('default 0 when likes missing from request', async () => {
    const newBlog = new Blog({
      title: 'Luminite pe balcon',
      author: 'Andrei Pirvan',
      url: 'https://complementor.dk/',
    });

    await api
      .post('/api/blogs')
      .set({ 'authorization': auth, Accept: 'application/json' })
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

    await api.post('/api/blogs')
      .send(newBlog)
      .set({ 'authorization': auth, Accept: 'application/json' })
      .expect(404);

    const response = await api
      .get('/api/blogs')
      .set({ 'authorization': auth, Accept: 'application/json' });

    expect(response.body).toHaveLength(helper.initialBlogs.length);
  });
});

describe('deletion of a blog ', () => {
  test('fails with status code 401 if user is not creator', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart.filter( (b) => { return b.user.toString() !== '5f29184ec0762454b8be7312'; })[0];

    
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'authorization': auth, Accept: 'application/json' })
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

  });


  test('succeeds with status code 200 if token user is the blog user', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart.filter( (b) => { return b.user.toString() === '5f2ae6d8f7c5a27a1858ad53'; })[0];

    const user = await helper.usersInDbById('5f2ae6d8f7c5a27a1858ad53');
    
    const userForToken = {
      username: user.username,
      id: user.id,
    };
  
    const token = jwt.sign(userForToken, process.env.SECRET);

    const authorization = 'bearer ' + token;

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set({ 'authorization': authorization, Accept: 'application/json' })
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length -1 );
    
    const titles = blogsAtEnd.map((r) => r.title);
    expect(titles).not.toContain(blogToDelete.title);
  });

});

describe('updating of a blog', () => {
  test('succeeds with status code 200 when likes is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToBeUpdated = blogsAtStart[0];

    const newBlog = blogToBeUpdated;
    newBlog.likes += 1;

    await api
      .put(`/api/blogs/${blogToBeUpdated.id}`)
      .set({ 'authorization': auth, Accept: 'application/json' })
      .send(newBlog)
      .expect(200);

    const blogsAtEnd = await helper.blogsInDb();

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
