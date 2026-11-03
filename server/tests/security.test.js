const request = require('supertest');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const app = require('../src/app');

describe('Security boundaries', () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  test('protects recommendations and safety mutations', async () => {
    const recommendationResponse = await request(app).get('/api/recommendations');
    const safetyResponse = await request(app).post('/api/safety/report').send({ reason: 'test report' });

    expect(recommendationResponse.status).toBe(401);
    expect(safetyResponse.status).toBe(401);
  });

  test('protects external map access behind authentication', async () => {
    const response = await request(app).get('/api/maps/geocode').query({ place: 'x' });
    expect(response.status).toBe(401);
  });
});
