const pool = require('../db/connection');
const secretAlgo = require('../controllers/autoApplyAlgo');

const createOrUpdateCV = async (req, res) => {
    try {
        const userEmail = req.user?.email; // Extract email from the token
        console.log('User Email:', userEmail);

        if (!userEmail) {
            return res.status(400).json({ message: 'User email not found in the request' });
        }

        const {
            full_name,
            email,
            phone,
            country,
            city,
            townOrArea,
            skills,
            experience,
            education,
            field_of_study,
        } = req.body;

        const cvFilePath = req.file ? req.file.path : null; // Get file path if uploaded

        // Retrieve userId from the email in the `users` table
        const [[userRecord]] = await pool.query(
            'SELECT user_id FROM users WHERE email = ?',
            [userEmail]
        );

        if (!userRecord) {
            return res.status(400).json({ message: 'No user found for the given email' });
        }

        const userId = userRecord.user_id;
        console.log('User ID:', userId);

        // Check if a CV already exists for this user
        const [existingCV] = await pool.query(
            'SELECT * FROM cvs WHERE user_id = ?',
            [userId]
        );

        if (existingCV.length > 0) {
            // Update existing CV
            await pool.query(
                `UPDATE cvs 
                 SET full_name = ?, email = ?, phone = ?, country = ? , city = ? , townOrArea = ? , skills = ?, experience = ?, education = ?, field_of_study = ?, cv_file_path = ? 
                 WHERE user_id = ?`,
                [full_name, email, phone , country  , city  , townOrArea , skills, experience, education, field_of_study, cvFilePath, userId]
            );


            //calling autoApplyAlgo()
            await secretAlgo();


            return res.status(200).json({ message: 'CV updated successfully!' });

        } else {
            // Create a new CV
            await pool.query(
                `INSERT INTO cvs (user_id, full_name, email, phone , country  , city  , townOrArea , skills, experience, education, field_of_study, cv_file_path)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? ,? ,?, ?)`,
                [userId, full_name, email, phone, country  , city  , townOrArea , skills, experience, education, field_of_study, cvFilePath]
            );

            //calling autoApplyAlgo()
            await secretAlgo();


            return res.status(200).json({ message: 'CV created successfully!' });
        }

    

    } catch (error) {
        console.error('Error handling CV:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

// module.exports = { createOrUpdateCV };



//new code
const path = require('path');
const getCVDetails = async (req, res) => {
    const userEmail = req.user?.email;

    try {
        // Fetch CV details for the logged-in user
        const [cvDetails] = await pool.query(
            `SELECT full_name, email, phone , country  , city  , townOrArea ,skills, experience, education, field_of_study, cv_file_path 
             FROM cvs 
             WHERE user_id = (SELECT user_id FROM users WHERE email = ? LIMIT 1)`,
            [userEmail]
        );

        if (cvDetails.length === 0) {
            return res.status(404).json({ message: 'No CV found for this user.' });
        }

        const cvData = cvDetails[0];

        // Prepare the response
        res.status(200).json({
            message: 'CV details fetched successfully.',
            cvDetails: {
                full_name: cvData.full_name,
                email: cvData.email,
                phone: cvData.phone,
                country: cvData.country,
                city: cvData.city,
                townOrArea: cvData.townOrArea,
                skills: cvData.skills,
                experience: cvData.experience,
                education: cvData.education,
                field_of_study: cvData.field_of_study,
                cv_file_url: `/uploads/${path.basename(cvData.cv_file_path)}`, // URL to fetch the file
            },
        });
    } catch (error) {
        console.error('Error fetching CV details:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};

module.exports = { getCVDetails , createOrUpdateCV } ;
 