const request = require('supertest');
const { app, User } = require('../index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

describe('Authentication Endpoints', () => {
  const testUser = {
    username: 'testuser',
    password: 'testpassword',
    email: 'test@example.com'
  };

  beforeAll(async () => {
    // Create a test user
    const hashedPassword = await bcrypt.hash(testUser.password, 10);
    await User.create({
      username: testUser.username,
      password: hashedPassword,
      email: testUser.email
    });
  });

  afterAll(async () => {
    // Clean up test user
    await User.destroy({ where: { username: testUser.username } });
  });

  describe('POST /login', () => {
    it('should login successfully with valid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: testUser.username,
          password: testUser.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app)
        .post('/login')
        .send({
          username: testUser.username,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('success', false);
    });
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        username: 'newuser',
        password: 'newpassword',
        email: 'new@example.com'
      };

      const res = await request(app)
        .post('/register')
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('userId');

      // Clean up
      await User.destroy({ where: { username: newUser.username } });
    });

    it('should fail when registering with existing username', async () => {
      const res = await request(app)
        .post('/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('success', false);
    });
  });
}); 