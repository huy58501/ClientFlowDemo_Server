# ClientFlow Server

This is the backend server for the ClientFlow application, built with Node.js, Express, and PostgreSQL.

## Features

- User authentication (login/register)
- JWT-based authorization
- PostgreSQL database with Sequelize ORM
- RESTful API endpoints

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the server directory:
   ```
   cd server
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

## Running the Server

### Development Mode

```
npm run dev
```

### Production Mode

```
npm start
```

## API Endpoints

### Authentication

- `POST /login` - User login
- `POST /register` - User registration

## Database Schema

### User

- `id` - Primary key
- `username` - Unique username
- `password` - Hashed password
- `email` - Unique email address
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Testing

Run tests with:

```
npm test
``` # ClientFlowDemo_Server
