const express = require('express');
const { login } = require('../controllers/auth.controller');
const checkApiKey = require('../middlewares/apiKey.middleware');

const router = express.Router();
router.post('/login', checkApiKey, login);

module.exports = router;
