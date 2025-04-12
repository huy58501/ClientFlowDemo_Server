const { User } = require('../index');
const bcrypt = require('bcrypt');

describe('User Model', () => {
  const testUser = {
    username: 'testuser',
    password: 'testpassword',
    email: 'test@example.com'
  };

  afterEach(async () => {
    // Clean up after each test
    await User.destroy({ where: { username: testUser.username } });
  });

  it('should create a new user successfully', async () => {
    const user = await User.create({
      username: testUser.username,
      password: testUser.password,
      email: testUser.email
    });

    expect(user.username).toBe(testUser.username);
    expect(user.email).toBe(testUser.email);
    expect(user.password).not.toBe(testUser.password); // Password should be hashed
  });

  it('should not create a user with duplicate username', async () => {
    await User.create({
      username: testUser.username,
      password: testUser.password,
      email: testUser.email
    });

    await expect(User.create({
      username: testUser.username,
      password: 'anotherpassword',
      email: 'another@example.com'
    })).rejects.toThrow();
  });

  it('should not create a user with duplicate email', async () => {
    await User.create({
      username: testUser.username,
      password: testUser.password,
      email: testUser.email
    });

    await expect(User.create({
      username: 'anotheruser',
      password: 'anotherpassword',
      email: testUser.email
    })).rejects.toThrow();
  });

  it('should validate password correctly', async () => {
    const user = await User.create({
      username: testUser.username,
      password: testUser.password,
      email: testUser.email
    });

    const isValidPassword = await bcrypt.compare(testUser.password, user.password);
    expect(isValidPassword).toBe(true);

    const isInvalidPassword = await bcrypt.compare('wrongpassword', user.password);
    expect(isInvalidPassword).toBe(false);
  });
}); 