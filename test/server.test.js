const request = require('supertest');
const app = require('../index');

describe('Server', () => {
  test('GET / should return "server is running"', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('server is running');
  });
}); 