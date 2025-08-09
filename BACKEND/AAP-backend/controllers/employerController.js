const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/connection');

// Employer Registration
const registerEmployer = async (req, res) => {
    const { first_name, last_name, email, phone, company_name, password } = req.body;

    try {
        const [existingEmployer] = await pool.query('SELECT * FROM employers WHERE email = ?', [email]);
        if (existingEmployer.length > 0) {
            return res.status(400).json({ message: 'Employer already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO employers (first_name, last_name, email, phone, company_name, password) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, company_name, hashedPassword]
        );

        res.status(201).json({ message: 'Employer registered successfully!' });
    } catch (error) {
        console.error('Error registering employer:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Employer Login
const loginEmployer = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [employer] = await pool.query('SELECT * FROM employers WHERE email = ?', [email]);
        if (employer.length === 0) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, employer[0].password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: employer[0].employer_id, email: employer[0].email, role: 'employer' },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in employer:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

 



// View Employer Profile
const getEmployerProfile = async (req, res) => {
    const employerId = req.user.id;
    
    try {
        const [employer] = await pool.query('SELECT * FROM employers WHERE employer_id = ?', [employerId]);
        if (employer.length === 0) {
            return res.status(404).json({ message: 'Employer not found' });
        }

        res.status(200).json(employer[0]);
    } catch (error) {
        console.error('Error fetching employer profile:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// Update Employer Profile
const updateEmployerProfile = async (req, res) => {
    const employerId = req.user.id;
    const { first_name, last_name, phone, company_name, bio, profession } = req.body;

    try {
        await pool.query(
            'UPDATE employers SET first_name = ?, last_name = ?, phone = ?, company_name = ?, bio = ?, profession = ? WHERE employer_id = ?',
            [first_name, last_name, phone, company_name, bio, profession, employerId]
        );

        res.status(200).json({ message: 'Profile updated successfully!' });
    } catch (error) {
        console.error('Error updating employer profile:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};



 
 
// Get applications for a specific job
const getJobApplications = async (req, res) => {
    try {
        // const { jobId } = req.params;
        // const employerId = req.user.id; // From authenticated employer token

        const employerId = req.user.id;
        const { job_id } = req.params;
        
        if(!job_id){
            console.log("No job id");
        }
        else if(!employerId){
            console.log("No emp id");
        }

        console.log("EMP ID: " , employerId);
        console.log("JOB ID: " , job_id);

        // Ensure the employer owns the job
        const job = await pool.query(
            'SELECT * FROM jobs WHERE job_id = ? AND employer_id = ?',
            [job_id, employerId]
        );

        if (job.length === 0) {
            return res.status(403).json({ error: 'Unauthorized or job not found.' });
        }
        
        // Fetch applications for this job
        const applications = await pool.query(
            `SELECT 
                applications.application_id, 
                applications.applied_at, 
                users.user_id, 
                users.first_name, 
                users.last_name, 
                users.email, 
                cvs.cv_file_path,
                cvs.skills, 
                cvs.experience, 
                cvs.education 
            FROM applications
            JOIN users ON applications.user_id = users.user_id
            JOIN cvs ON users.user_id = cvs.user_id
            WHERE applications.job_id = ?`,
            [job_id]
        );

        res.status(200).json({ applications });
    } catch (error) {
        console.error('Error fetching job applications:', error);
        res.status(500).json({ error: 'Server error.' });
    }
};




const getCreatedJobs = async (req, res) => {
    const employerId = req.user.id;
        try {
    
            const [jobs] = await pool.query(
                `SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.job_req_skills, 
                        jobs.job_req_education, jobs.job_type, jobs.salary_range, 
                        jobs.location_country, jobs.location_city, jobs.location_town, 
                        employers.company_name 
                 FROM jobs 
                 JOIN employers ON jobs.employer_id = employers.employer_id 
                 where jobs.employer_id = ?` ,  [employerId] 
            );
     
            

            res.status(200).json(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            res.status(500).json({ message: 'Internal server error', error });
        }
    };
 

//new code-close

module.exports = { registerEmployer, loginEmployer, getEmployerProfile, updateEmployerProfile , getJobApplications , getCreatedJobs};


