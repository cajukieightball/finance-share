import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

let cookie;
let postId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST);
  // clear all collections
  for (const col of Object.values(mongoose.connection.collections)) {
    await col.deleteMany({});
  }
  // register & login a user
  const email = `user1+${Date.now()}@example.com`;
  const password = 'pass1234';
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'user1', email, password })
    .expect(201);

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
    .expect(200);

  cookie = loginRes.headers['set-cookie'][0];
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Posts routes', () => {
  it('rejects unauthenticated access', async () => {
    await request(app).get('/api/posts').expect(401);
    await request(app).post('/api/posts').send({ content: 'x' }).expect(401);
  });

  it('creates a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Cookie', cookie)
      .send({ content: 'Hello world', tags: ['t1'] })
      .expect(201);

    expect(res.body._id).toBeDefined();
    postId = res.body._id;
  });

  it('fetches all posts', async () => {
    const res = await request(app)
      .get('/api/posts')
      .set('Cookie', cookie)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.find(p => p._id === postId)).toBeTruthy();
  });

  it('updates its own post', async () => {
    const res = await request(app)
      .patch(`/api/posts/${postId}`)
      .set('Cookie', cookie)
      .send({ content: 'Updated!' })
      .expect(200);
    expect(res.body.content).toBe('Updated!');
  });

  it('rejects update with invalid ID', async () => {
    await request(app)
      .patch('/api/posts/invalid-id')
      .set('Cookie', cookie)
      .send({ content: 'nope' })
      .expect(400); 
  });

  it('rejects update by another user', async () => {
    // register a second user
    const email2 = `user2+${Date.now()}@example.com`;
    const password2 = 'pass5678';
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'user2', email: email2, password: password2 })
      .expect(201);

    const login2 = await request(app)
      .post('/api/auth/login')
      .send({ email: email2, password: password2 })
      .expect(200);
    const cookie2 = login2.headers['set-cookie'][0];

    await request(app)
      .patch(`/api/posts/${postId}`)
      .set('Cookie', cookie2)
      .send({ content: 'hacked' })
      .expect(403);
  });

  it('deletes its own post', async () => {
    await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Cookie', cookie)
      .expect(200);
  });
});
