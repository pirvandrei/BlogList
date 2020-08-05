const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/user');
const helper = require('./test_helper');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('sekret', 10);
  const user = new User({ username: 'root', passwordHash });

  await user.save();
});

const auth =
  'bearer bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InJvb3QiLCJpZCI6IjVmMmFhZDllODRlYTU0NjQ5NGY2ODkzYyIsImlhdCI6MTU5NjYzNjQwOH0.dSBcxffJfTWZSdoUebjr9q6gNGz3PvjLhy7yQZRTJDU';


describe('when there is initially one user in db', () => {
  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'pirvandrei',
      name: 'Andrei Pirvan',
      password: 'ilieman',
    };

    await api
      .post('/api/users')
      .set({ 'Authorization': auth, Accept: 'application/json' })
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});


describe('when there is initially one user in db', () => {

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    };

    const result = await api
      .post('/api/users')
      .set({ 'Authorization': auth, Accept: 'application/json' })
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('`username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});   

afterAll(() => {
  mongoose.connection.close();
});
