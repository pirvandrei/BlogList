const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    author: 1,
    title: 1,
  });

  response.json(users);
});

userRouter.post('/', async (request, response) => {
  const body = request.body;

  if (body.password === undefined || body.username === undefined) {
    return response.status(404).json({
      error: 'bad request',
    });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(body.password, saltRounds);

  const newUser = new User({
    name: body.name,
    username: body.username,
    blogs: body.blogs,
    passwordHash,
  });

  const savedUser = await newUser.save();

  response.json(savedUser);
});

module.exports = userRouter;
