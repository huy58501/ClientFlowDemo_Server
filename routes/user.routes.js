const express = require('express');
const { getAllUsers, getUserByUsername } = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.middleware');
const checkApiKey = require('../middlewares/apiKey.middleware');
const router = express.Router();

router.post('/', checkApiKey, verifyToken, getAllUsers); 
router.post('/me', checkApiKey, verifyToken, getUserByUsername);

module.exports = router;
