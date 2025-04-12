const request = require('supertest');
const app = require('../index');

describe('Server', () => {
  // Store the original environment variables
  let originalEnv;

  beforeAll(() => {
    // Save original environment
    originalEnv = process.env;
    // Set a known API key for testing
    process.env = { ...process.env, API_KEY: 'test-api-key' };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  test('GET / should return "server is running"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('server is running');
  });

  test('Server should handle JSON requests with incorrect API key', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('x-api-key', 'wrong-test-key')
      .send({ username: 'testuser', password: 'testpassword' });
    
    expect(response.statusCode).toBe(403);
    expect(response.body).toHaveProperty('error', 'Invalid API key');
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

  test('Server should handle user authentication with valid API key', async () => {
    const response = await request(app)
      .post('/login')
      .set('Content-Type', 'application/json')
      .set('x-api-key', 'test-api-key')
      .send({ username: 'testuser', password: 'testpassword' });
    
    // Now we expect a 401 since the user doesn't exist
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid username');
  });
}); 