// // Apply for a job
// const applyForJob = async (req, res) => {
//     const userId = req.user.id;
//     const { job_id } = req.body;
    
//     try {
//         // Check if the user already applied for this job
//         const [existingApplication] = await pool.query(
//             'SELECT * FROM job_applications WHERE user_id = ? AND job_id = ?',
//             [userId, job_id]
//         );

//         if (existingApplication.length > 0) {
//             return res.status(400).json({ message: 'You have already applied for this job.' });
//         }

//         // Insert new application
//         await pool.query(
//             'INSERT INTO job_applications (user_id, job_id) VALUES (?, ?)',
//             [userId, job_id]
//         );

//         res.status(201).json({ message: 'Job application submitted successfully!' });
//     } catch (error) {
//         console.error('Error applying for job:', error);
//         res.status(500).json({ message: 'Internal server error', error });
//     }
// };

// module.exports = { applyForJob };
