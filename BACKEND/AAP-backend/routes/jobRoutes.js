const express = require('express');


 
 
const { createJob, getAllJobs, getJobById , deleteJob , updateJob , applyForJob , getAppliedJobs} = require('../controllers/jobController');
const authMiddleware = require('../middlewares/authMiddleware');

 


const router = express.Router();



 

// GET /api/jobs - Get all jobs
router.get('/', getAllJobs);



// Fetch Applied Jobs
router.get('/applied', authMiddleware, getAppliedJobs);



// GET /api/jobs/:job_id - Get a specific job
router.get('/:job_id', getJobById);

// POST /api/jobs - Create Job (employers only)
router.post('/', authMiddleware, createJob);


 

// DELETE job
router.delete('/delete/:job_id', authMiddleware, deleteJob);

 
 

// PUT/Update job
router.put('/update/:job_id', authMiddleware, updateJob);



// Apply for a Job
router.post('/:job_id/apply', authMiddleware, applyForJob);

 

 




module.exports = router;




 