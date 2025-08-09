// db/connection.js
require('dotenv').config(); // Ensure this line is at the top to load environment variables

const mysql = require('mysql2/promise'); // Ensure you're using the promise-based version

const pool = mysql.createPool({
    host: process.env.DB_HOST,         // Load from .env file
    user: process.env.DB_USER,         // Load from .env file
    password: process.env.DB_PASSWORD, // Load from .env file
    database: process.env.DB_NAME      // Load from .env file
});

module.exports = pool; // Export the pool for querying the database
