const express = require('express');
const cors = require('cors');

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:3000', // Your frontend URL
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'Cookie']
}));

// Parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => res.send('Server is running'));
app.use('/auth', require('./routes/auth.routes')); 
app.use('/users', require('./routes/user.routes'));

module.exports = app;
