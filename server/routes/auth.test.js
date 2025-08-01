import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST);
  await mongoose.connection.db.dropDatabase();
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Auth routes', () => {
  it('should register, login, and return me', async () => {
    const email = `test${Date.now()}@example.com`;

    await request(app)
      .post('/api/auth/register')
      .send({ username: 'tester', email, password: 'pass1234' })
      .expect(201)
      .expect('set-cookie', /token=/);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email, password: 'pass1234' })
      .expect(200)
      .expect('set-cookie', /token=/);

    const cookie = loginRes.headers['set-cookie'][0];

    const meRes = await request(app)
      .get('/api/auth/me')
      .set('Cookie', cookie)
      .expect(200);

    expect(meRes.body.userId).toBeDefined();
  });
});
