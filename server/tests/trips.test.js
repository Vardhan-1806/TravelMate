const request = require('supertest');
const { connectTestDB, closeTestDB, clearTestDB } = require('./setup');
const app = require('../src/app');

describe('Trip creation and discovery', () => {
  beforeAll(async () => await connectTestDB());
  afterAll(async () => await closeTestDB());
  afterEach(async () => await clearTestDB());

  test('creates a safe public trip and exposes it to logged-out discovery', async () => {
    const agent = request.agent(app);

    await agent.post('/api/auth/register').send({
      name: 'Trip Host',
      email: 'host@example.com',
      password: 'Password123',
    });

    const login = await agent.post('/api/auth/login').send({
      email: 'host@example.com',
      password: 'Password123',
    });

    const created = await agent
      .post('/api/trips')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .send({
        title: 'Goa coast and cafes',
        source: 'Hyderabad',
        destination: 'Goa',
        startDate: '2030-12-20',
        endDate: '2030-12-24',
        budgetPerPerson: 8000,
        maxMembers: 6,
        currentMembers: 99,
        status: 'COMPLETED',
        tripType: ['Relaxed', 'Food'],
      });

    expect(created.status).toBe(201);
    expect(created.body.trip.currentMembers).toBe(1);
    expect(created.body.trip.status).toBe('OPEN');

    const discovered = await request(app).get('/api/trips').query({
      destination: 'Goa',
      startDate: '2030-12-22',
      endDate: '2030-12-23',
    });

    expect(discovered.status).toBe(200);
    expect(discovered.body.trips).toHaveLength(1);

    const publicDetails = await request(app).get(`/api/trips/${created.body.trip._id}`);
    expect(publicDetails.status).toBe(200);
    expect(publicDetails.body.trip.destination).toBe('Goa');
  });

  test('rejects invalid trip identifiers instead of returning a server error', async () => {
    const response = await request(app).get('/api/trips/not-an-object-id');
    expect(response.status).toBe(404);
  });
});
