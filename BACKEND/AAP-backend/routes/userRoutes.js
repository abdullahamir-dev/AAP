const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../db/connection'); // Database connection
const { getUserProfile, updateUserProfile } = require('../controllers/userController'); // Import controller functions
const authMiddleware = require('../middlewares/authMiddleware'); // JWT authentication middleware

const router = express.Router();

// POST route to register a user
router.post('/register', async (req, res) => {
    const { first_name, last_name, email, phone, dob, password } = req.body;

    try {
        // Check if user already exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user into the database
        await pool.query(
            'INSERT INTO users (first_name, last_name, email, phone, dob, password) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, dob, hashedPassword]
        );

        return res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error in registering user:', error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
});

// Fetch user profile
router.get('/profile', authMiddleware, getUserProfile);

// Update user profile
router.put('/profile', authMiddleware, updateUserProfile);

module.exports = router; // Export routes
