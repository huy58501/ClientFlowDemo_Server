const request = require('supertest');
const app = require('../index');

describe('Server', () => {
  test('GET / should return "server is running"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('server is running');
  });

  test('Server should handle JSON requests', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('x-api-key', process.env.API_KEY || 'test-key')
      .send({ username: 'testuser', password: 'testpassword' });
    
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error');
  });

  test('Server should reject requests with invalid API key', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('x-api-key', 'invalid-key')
      .send({ username: 'testuser', password: 'testpassword' });
    
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Invalid API key');
  });
}); 