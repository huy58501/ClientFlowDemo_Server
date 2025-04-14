const prisma = require('../lib/prisma');

exports.getAllUsers = async (req, res) => {
  const isAdmin = req.user.role === 'admin';

  if (!isAdmin) {
    return res.status(403).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
        loginHistory: {
          select: {
            ip: true,
            device: true,
            login_time: true,
          }
        }
      }
    });
    res.status(200).json({ success: true, users });

  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ success: false, error: 'Failed to get users' });
  }

};

exports.getUserByUsername = async (req, res) => {
  try {    
    // Get username from request body
    const requestedUsername = req.body.username;
    
    // Check if username is provided
    if (!requestedUsername) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }
    
    // Check if the authenticated user is admin or requesting their own data
    const isAdmin = req.user.role === 'admin';
    const isSelf = req.user.username === requestedUsername;
    
    if (!isAdmin && !isSelf) {
      return res.status(403).json({ success: false, error: 'Unauthorized access' });
    }
    
    const user = await prisma.user.findUnique({
      where: { username: requestedUsername },
      select: {
        id: true,
        username: true,
        role: true,
        created_at: true,
        loginHistory: {
          select: {
            ip: true,
            device: true,
            login_time: true,
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    
    res.status(200).json({ success: true, user, role: req.user.role });
  } catch (err) {
    console.error('getUserByUsername error:', err);
    res.status(500).json({ success: false, error: 'Failed to get user' });
  }
};
