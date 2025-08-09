const express = require('express');
const { togglePreference  , shouldAvertise } = require('../controllers/preferencesController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// PUT /api/preferences/toggle - Toggle Auto-Apply Preference
router.post('/toggle', authMiddleware, togglePreference);

 
// GET /api/preference/advertise - Handle advertisement and toggle button state on page load
router.get('/advertise', authMiddleware, shouldAvertise);

 

 

module.exports = router;
