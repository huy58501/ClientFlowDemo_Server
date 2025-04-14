const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { username, password, ip, userAgent } = req.body;
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== process.env.API_KEY) {
    return res.status(403).json({ error: 'Invalid API key' });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return res.status(401).json({ error: 'Invalid username' });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ error: 'Invalid password' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    try {
      await prisma.loginHistory.create({
        data: {
          username: user.username,
          ip: ip,
          device: userAgent,
          login_time: new Date(),
        }
      });
    } catch (historyError) {
      console.error('Error creating login history:', historyError);
      // Continue with login even if history creation fails
    }

    res.status(200).json({ success: true, message: 'Login successful', token });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
};
