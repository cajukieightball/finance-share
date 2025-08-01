import request from 'supertest';
import app from '../server.js';
import mongoose from 'mongoose';

let cookie, postId, commentId;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI_TEST);
  for (const col of Object.values(mongoose.connection.collections)) {
    await col.deleteMany({});
  }

  const email = `cuser+${Date.now()}@example.com`;
  const password = 'cpass1234';
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'cuser', email, password })
    .expect(201);

  const login = await request(app)
    .post('/api/auth/login')
    .send({ email, password })
    .expect(200);
  cookie = login.headers['set-cookie'][0];

  const postRes = await request(app)
    .post('/api/posts')
    .set('Cookie', cookie)
    .send({ content: 'Post for comments', tags: [] })
    .expect(201);
  postId = postRes.body._id;
});

afterAll(async () => {
  await mongoose.disconnect();
});

describe('Comments routes', () => {
  it('rejects unauthenticated fetch/create', async () => {
    await request(app).get(`/api/comments?postId=${postId}`).expect(401);
    await request(app)
      .post('/api/comments')
      .send({ postId, content: 'x' })
      .expect(401);
  });

  it('rejects missing postId', async () => {
    await request(app).get('/api/comments').set('Cookie', cookie).expect(400);
  });

  it('creates a comment', async () => {
    const res = await request(app)
      .post('/api/comments')
      .set('Cookie', cookie)
      .send({ postId, content: 'First comment' })
      .expect(201);
    commentId = res.body._id;
  });

  it('fetches comments for post', async () => {
    const res = await request(app)
      .get(`/api/comments?postId=${postId}`)
      .set('Cookie', cookie)
      .expect(200);
    expect(res.body[0]._id).toBe(commentId);
  });

  it('updates its own comment', async () => {
    const res = await request(app)
      .patch(`/api/comments/${commentId}`)
      .set('Cookie', cookie)
      .send({ content: 'Edited comment' })
      .expect(200);
    expect(res.body.content).toBe('Edited comment');
  });

  it('rejects update with invalid ID', async () => {
    await request(app)
      .patch('/api/comments/invalid-id')
      .set('Cookie', cookie)
      .send({ content: 'xxx' })
      .expect(400);
  });

  it('rejects delete with invalid ID', async () => {
    await request(app)
      .delete('/api/comments/invalid-id')
      .set('Cookie', cookie)
      .expect(400);
  });

  it('deletes its own comment', async () => {
    await request(app)
      .delete(`/api/comments/${commentId}`)
      .set('Cookie', cookie)
      .expect(200);
  });

  it('rejects delete by another user', async () => {
    const res2 = await request(app)
      .post('/api/comments')
      .set('Cookie', cookie)
      .send({ postId, content: 'Another comment' })
      .expect(201);
    const newCommentId = res2.body._id;

    const email2 = `cuser2+${Date.now()}@example.com`;
    const password2 = 'abc12345';
    await request(app)
      .post('/api/auth/register')
      .send({ username: 'cuser2', email: email2, password: password2 })
      .expect(201);
    const login2 = await request(app)
      .post('/api/auth/login')
      .send({ email: email2, password: password2 })
      .expect(200);
    const cookie2 = login2.headers['set-cookie'][0];

    await request(app)
      .delete(`/api/comments/${newCommentId}`)
      .set('Cookie', cookie2)
      .expect(403);
  });
});
