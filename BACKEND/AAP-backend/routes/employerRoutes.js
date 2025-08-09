const express = require('express');
const { registerEmployer, loginEmployer, getEmployerProfile, updateEmployerProfile , getJobApplications , getCreatedJobs} = require('../controllers/employerController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// POST /api/employers/register - Employer Registration
router.post('/register', registerEmployer);

// POST /api/employers/login - Employer Login
router.post('/login', loginEmployer);






 


// GET /api/employers/profile - View Employer Profile
router.get('/profile', authMiddleware, getEmployerProfile);

// PUT /api/employers/profile - Update Employer Profile
router.put('/profile', authMiddleware, updateEmployerProfile);


 

// Get applications for a job by jobId
router.get('/applications/:job_id', authMiddleware, getJobApplications);

 

// GET /api/jobs - Get all jobs
router.get('/createdJobs', authMiddleware , getCreatedJobs);



module.exports = router;

