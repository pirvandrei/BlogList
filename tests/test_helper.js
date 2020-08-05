const Blog = require('../models/blog');
const User = require('../models/user');

const initialUsers = [
  {
    _id: '5f29184ec0762454b8be7312',
    username: 'pirvandrei',
    name: 'Andrei',
    passwordHash:
      '$2b$10$VLzurjVQ4P1GfG4Qd8.H0.Y4hHOxjM7DrI1Hgsbpkj1mqFrVpFPSG',
    __v: 5,
    blogs: [
      '5f2acd68e52498806c2f4968',
      '5f2ad3be70b1928b18f2aecf',
      '5f2ad42370b1928b18f2aed0',
    ],
  },
  {
    _id: '5f291884c0762454b8be7313',
    username: 'pirvandreea',
    name: 'Andreea',
    passwordHash:
      '$2b$10$2ED353q8f0XAQLmuolqYqu1fICR8nlNFM2DYjsyapcxf9FrN6lOQm',
    __v: 1,
  },
  {
    _id: '5f2ae6d8f7c5a27a1858ad53',
    blogs: [],
    name: 'root',
    username: 'root',
    passwordHash:
      '$2b$10$L7Ho30FbCriaqx8uGCY6Mu78VBo.7hkyOUPomMj5s1fBTcQAgQsES',
    __v: 0,
  },
];

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    user: '5f291884c0762454b8be7313',
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url:
      'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    user: '5f2ae6d8f7c5a27a1858ad53',
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    user: '5f291884c0762454b8be7313',
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    user: '5f29184ec0762454b8be7312',
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url:
      'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    user: '5f29184ec0762454b8be7312',
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    user: '5f29184ec0762454b8be7312',
    __v: 0,
  },
];

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((u) => u.toJSON());
};

const usersInDbById = async (id) => {
  const user = await User.findById(id);
  return user.toJSON();
};

module.exports = {
  initialUsers,
  initialBlogs,
  blogsInDb,
  usersInDb,
  usersInDbById,
};
