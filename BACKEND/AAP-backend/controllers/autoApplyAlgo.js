const pool = require('../db/connection');

const autoApplyAlgo = async () => {
    try {
        // Fetch all users who enabled auto-apply
        const [users] = await pool.query(
            `SELECT users.user_id, users.email, cvs.skills, cvs.education, cvs.experience, cvs.country, cvs.city, 
             cvs.townOrArea , cvs.cv_file_path
             FROM users 
             JOIN cvs ON users.user_id = cvs.user_id 
             JOIN UserPreferences ON users.user_id = UserPreferences.user_id 
             WHERE UserPreferences.auto_apply = true`
        );
        
        if (users.length === 0) {
            console.log('No users with auto-apply enabled.');
            return;
        }

        // Fetch all jobs
        const [jobs] = await pool.query(
            `SELECT job_id, job_req_skills, job_req_education , location_country, location_city, location_town, job_type 
             FROM jobs`
        );

        if (jobs.length === 0) {
            console.log('No jobs available.');
            return;
        }

        // Fetch existing applications to avoid duplicates
        const [existingApplications] = await pool.query(
            `SELECT user_id, job_id FROM applications`
        );
        const appliedJobs = new Set(existingApplications.map(app => `${app.user_id}-${app.job_id}`));

        const applicationsToInsert = [];

        // Match users with jobs
        users.forEach(user => {
            jobs.forEach(job => {
                // Skip if already applied
                if (appliedJobs.has(`${user.user_id}-${job.job_id}`)) return;

                // Match requirements
                const skillsMatch = matchPatterns(user.skills, job.job_req_skills, 3); // At least 3 skill matches
                const educationMatch = matchPatterns(user.education, job.job_req_education);
                // const experienceMatch = matchPatterns(user.experience, job.job_req_experience);
         
                // Match location
                const locationScore = matchLocation(
                    { country: user.country , city: user.city, town: user.townOrArea},
                    { country: job.location_country, city: job.location_city, town: job.location_town },
                    job.job_type // Pass job type to handle remote jobs
                );

                // Calculate final score
                const requirementsScore = skillsMatch + educationMatch  ;
                const totalScore = requirementsScore + locationScore;
                console.log("Total Score: ", totalScore);

                // Apply if the job meets the threshold
                if (totalScore >= 2) { // Define a threshold for application
                    applicationsToInsert.push([job.job_id, user.user_id, user.cv_file_path , 'AutoApplyPro', new Date()]);
                }
            });
        });
        
        // Insert new applications
        if (applicationsToInsert.length > 0) {
            await pool.query(
                `INSERT INTO applications (job_id, user_id, cv_file_path, appliedBy, applied_at) VALUES ?`,
                [applicationsToInsert]
            );
            console.log(`${applicationsToInsert.length} applications were successfully created.`);
        } else {
            console.log('No new applications were created.');
        }
    } catch (error) {
        console.error('Error in autoApplyAlgo:', error);
    }
};

// Advanced pattern matching with thresholds
const matchPatterns = (userField, jobField, minMatches = 1) => {
    if (!userField || !jobField) return 0; // Ensure both fields are present
    const userTokens = userField.toLowerCase().split(',').map(s => s.trim());
    const jobTokens = jobField.toLowerCase().split(',').map(s => s.trim());
    const matches = jobTokens.filter(token => userTokens.includes(token));
    return matches.length >= minMatches ? 1 : 0; // Return 1 if minimum matches are met, otherwise 0
};

// Advanced location matching
const matchLocation = (userLocation, jobLocation, jobType) => {
    if (jobType === 'Remote') return 1; // Full score for remote jobs

    let score = 0;
    if (userLocation.country.toLowerCase() === jobLocation.country.toLowerCase()) score += 0.7; // Country match (100%)
    if (
        userLocation.country.toLowerCase() === jobLocation.country.toLowerCase() &&
        userLocation.city.toLowerCase() === jobLocation.city.toLowerCase()
    )
        score += 0.9; // Country and city match (90%)
    if (
        userLocation.country.toLowerCase() === jobLocation.country.toLowerCase() &&
        userLocation.city.toLowerCase() === jobLocation.city.toLowerCase() &&
        userLocation.town.toLowerCase() === jobLocation.town.toLowerCase()
    )
        score += 1; // Country, city, and town match (70%)

    return Math.min(score, 1); // Cap the score at 1
};

module.exports = autoApplyAlgo;


