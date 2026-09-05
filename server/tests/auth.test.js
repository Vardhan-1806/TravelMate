const request = require('supertest');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const app = require('../src/app');

describe('Authentication', () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  test('registers a new user with hashed password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
    });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('test@example.com');
    expect(res.body.user.password).toBeUndefined();
  });

  test('rejects duplicate email registration', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'First', email: 'dup@example.com', password: 'Password123',
    });

    const res = await request(app).post('/api/auth/register').send({
      name: 'Second', email: 'dup@example.com', password: 'Password123',
    });

    expect(res.status).toBe(409);
  });

  test('rejects login with wrong password using generic message', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Test', email: 'wrongpass@example.com', password: 'CorrectPass123',
    });

    const res = await request(app).post('/api/auth/login').send({
      email: 'wrongpass@example.com', password: 'WrongPassword',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('rejects login for nonexistent email with the SAME generic message', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'doesnotexist@example.com', password: 'AnyPassword123',
    });

    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid email or password');
  });

  test('blocks access to protected route without a token', async () => {
    const res = await request(app).get('/api/profile/me');
    expect(res.status).toBe(401);
  });
});