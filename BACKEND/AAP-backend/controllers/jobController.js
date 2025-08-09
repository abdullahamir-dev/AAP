const pool = require('../db/connection');
const secretAlgo = require('../controllers/autoApplyAlgo');


// Create a Job
const createJob = async (req, res) => {
    const employerId = req.user.id;
    const { job_title, job_description, job_req_skills, job_req_education, job_type, salary_range, location_country, location_city, location_town } = req.body;

    try {
        await pool.query(
            'INSERT INTO jobs (employer_id, job_title, job_description, job_req_skills, job_req_education, job_type, salary_range, location_country, location_city, location_town) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [employerId, job_title, job_description, job_req_skills, job_req_education, job_type, salary_range, location_country, location_city, location_town]
        );
        
        //autoApplyCalling()
        await secretAlgo();
        
        res.status(201).json({ message: 'Job created successfully!' });
    } catch (error) {
        console.error('Error creating job:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
    try {

        const [jobs] = await pool.query(
            `SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.job_req_skills, 
                    jobs.job_req_education, jobs.job_type, jobs.salary_range, 
                    jobs.location_country, jobs.location_city, jobs.location_town, 
                    employers.company_name 
             FROM jobs 
             JOIN employers ON jobs.employer_id = employers.employer_id`
        );

        res.status(200).json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Get a Specific Job by ID
const getJobById = async (req, res) => {
    const { job_id } = req.params; // Ensure job_id is being extracted correctly
    
    if (!job_id) {
        return res.status(400).json({ message: 'Job ID is required' });
    }

    try {
        const [job] = await pool.query(
            `SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.job_req_skills, 
                    jobs.job_req_education, jobs.job_type, jobs.salary_range, 
                    jobs.location_country, jobs.location_city, jobs.location_town, 
                    employers.company_name 
             FROM jobs 
             JOIN employers ON jobs.employer_id = employers.employer_id
             WHERE jobs.job_id = ?`,
            [job_id]
        );

        if (job.length === 0) {
            return res.status(404).json({ message: 'Job not found' });
        }

        res.status(200).json(job[0]); // Return job details
    } catch (error) {
        console.error('Error fetching job:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Delete a Job
const deleteJob = async (req, res) => {
    const employerId = req.user.id;
    const { job_id } = req.params;
    
    if (!job_id) {
        console.log("job id not found from deleteJob");
        return res.status(400).json({ message: 'Job ID is required' });
    }

    if(!employerId){
        console.log("employerId id not found from deleteJob");
    }
    console.log("JOB ID: ",job_id);
    console.log("Employer ID: ",employerId);

    try {
        const [job] = await pool.query('SELECT * FROM jobs WHERE job_id = ? AND employer_id = ?', [job_id, employerId]);
        if (job.length === 0) {
            return res.status(404).json({ message: 'Job not found or you are not authorized to delete it' });
        }
        
        await pool.query('DELETE FROM jobs WHERE job_id = ?', [job_id]);
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting job:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Update a Job
const updateJob = async (req, res) => {
    const employerId = req.user.id;
    const { job_id } = req.params;
    const { job_title, job_description, job_req_skills, job_req_education, job_type, salary_range, location_country, location_city, location_town } = req.body;

    if (!job_id) {
        console.log("job id not found from updateJob");
        return res.status(400).json({ message: 'Job ID is required' });
    }

    if(!employerId){
        console.log("employerId id not found from updateJob");
    }
    
    try {
        const [job] = await pool.query('SELECT * FROM jobs WHERE job_id = ? AND employer_id = ?', [job_id, employerId]);
        if (job.length === 0) {
            return res.status(404).json({ message: 'Job not found or you are not authorized to update it' });
        }

        await pool.query(
            `UPDATE jobs SET job_title = ?, job_description = ?, job_req_skills = ?, job_req_education = ?, job_type = ?, 
            salary_range = ?, location_country = ?, location_city = ?, location_town = ? WHERE job_id = ?`,
            [job_title, job_description, job_req_skills, job_req_education, job_type, salary_range, location_country, location_city, location_town, job_id]
        );

        //autoApplyCalling()
        await secretAlgo();
       
        res.status(200).json({ message: 'Job updated successfully' });
    } catch (error) {
        console.error('Error updating job:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};



//new
// Apply for a Job
// const applyForJob = async (req, res) => {
//     const userId = req.user.id; // Extract user ID from token
//     const { job_id } = req.params;

//     try {
//         // Check if the candidate has uploaded a CV
//         const [cv] = await pool.query('SELECT cv_file_path FROM cvs WHERE user_id = ?', [userId]);
//         if (cv.length === 0) {
//             return res.status(400).json({ message: 'You need to upload a CV before applying for a job.' });
//         }

//         // Check if the candidate has already applied for the job
//         const [existingApplication] = await pool.query('SELECT * FROM applications WHERE job_id = ? AND user_id = ?', [job_id, userId]);
//         if (existingApplication.length > 0) {
//             return res.status(400).json({ message: 'You have already applied for this job.' });
//         }

//         // Insert application record into the database
//         await pool.query(
//             'INSERT INTO applications (job_id, user_id, cv_file_path) VALUES (?, ?, ?)',
//             [job_id, userId, cv[0].cv_file_path]
//         );

//         res.status(201).json({ message: 'Application submitted successfully!' });
//     }   catch (error) {
//         console.error('Error applying for job:', error);
//         res.status(500).json({ message: 'Internal server error', error });
//     }
// };





const applyForJob = async (req, res) => {
    //const userId = req.user.id; // Extract user ID from JWT
    const userEmail = req.user?.email; // Extract email from the token
     
    const { job_id } = req.params;

    if (!job_id) {
        return res.status(400).json({ message: 'Job ID is required' });
    }

    try {

        // Retrieve userId from the email in the `users` table
        const [[userRecord]] = await pool.query(
            'SELECT user_id FROM users WHERE email = ?',
            [userEmail]
        );

        

         
        const userId = userRecord.user_id;
        console.log('User ID:', userId);

        const [[cvRecord]] = await pool.query(
            'SELECT cv_file_path FROM cvs WHERE user_id = ?',
             [userId]
        );

        const cvFilePath = cvRecord.cv_file_path;
        

        // Check if the user has already applied for the job
        const [existingApplication] = await pool.query(
            'SELECT * FROM applications WHERE job_id = ? AND user_id = ?',
            [job_id, userId]
        );

        if (existingApplication.length > 0) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }
        
        // Insert new application
        await pool.query(
            'INSERT INTO applications (job_id, user_id, cv_file_path , applied_at ) VALUES (?, ? , ? , NOW())',
            [job_id, userId , cvFilePath]
        );

        res.status(201).json({ message: 'Successfully applied for the job!' });
    } catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};




//new code
// Fetch Applied Jobs for a Specific User
// const getAppliedJobs = async (req, res) => {
//     const userId = req.user.id;
//     console.log(userId);

//     try {
//         const [appliedJobs] = await pool.query(
//             `SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.job_type, jobs.salary_range,
//                     jobs.location_country, jobs.location_city, jobs.location_town,
//                     employers.company_name, applications.applied_at
//              FROM applications
//              JOIN jobs ON applications.job_id = jobs.job_id
//              JOIN employers ON jobs.employer_id = employers.employer_id
//              WHERE applications.user_id = ?
//              ORDER BY applications.applied_at DESC`,
//             [userId]
//         );

//         if (appliedJobs.length === 0) {
//             return res.status(200).json({ message: 'No applied jobs found.', jobs: [] });
//         }

//         res.status(200).json({ jobs: appliedJobs });
//     } catch (error) {
//         console.log(error);
//         console.error('Error fetching applied jobs:', error);
//         res.status(500).json({ message: 'Internal server error', error });
//     }
// };

const getAppliedJobs = async (req, res) => {
    
    const userEmail = req.user?.email; // Extract email from the token


    // Retrieve userId from the email in the `users` table
    const [[userRecord]] = await pool.query(
        'SELECT user_id FROM users WHERE email = ?',
        [userEmail]
    );


    userId = userRecord.user_id;
    console.log('User ID:', userId);


    if(!userId){
        console.log("No user id were found!");
        return;
    }

    try {
        const [appliedJobs] = await pool.query(
            `SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.job_type, jobs.salary_range,
                    jobs.location_country, jobs.location_city, jobs.location_town,
                    employers.company_name, applications.applied_at , applications.appliedBy
             FROM applications
             JOIN jobs ON applications.job_id = jobs.job_id
             JOIN employers ON jobs.employer_id = employers.employer_id
             WHERE applications.user_id = ?
             ORDER BY applications.applied_at DESC`,
            [userId]
        );
        
        if (appliedJobs.length === 0) {
            return res.status(200).json({ message: 'No applied jobs found.', jobs: [] });
        }

        res.status(200).json({ jobs: appliedJobs });
    } catch (error) {
        console.error('Error fetching applied jobs:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};



module.exports = { createJob, getAllJobs, getJobById, deleteJob, updateJob , applyForJob , getAppliedJobs};


