const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

// Login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


         

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user.id, email: user.email, first_name: user.first_name },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Fetch user profile
const getUserProfile = async (req, res) => {
    const { email } = req.user;

    try {
        const [rows] = await pool.query(
            'SELECT first_name, last_name, email, phone, bio, profession, experience, education, skills, profile_picture FROM users WHERE email = ?',
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(rows[0]);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Update user profile
const updateUserProfile = async (req, res) => {
    const { email } = req.user;
    const { first_name, last_name, phone, bio, profession, experience, education, skills, profile_picture } = req.body;

    // Validate required fields
    if (!first_name || !last_name || !email) {
        return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    try {
        await pool.query(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ?, bio = ?, profession = ?, experience = ?, education = ?, skills = ?, profile_picture = ? WHERE email = ?',
            [first_name, last_name, phone, bio, profession, experience, education, skills, profile_picture, email]
        );

        res.json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    loginUser,
    getUserProfile,
    updateUserProfile,
};
