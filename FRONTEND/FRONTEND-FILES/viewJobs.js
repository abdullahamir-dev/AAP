document.addEventListener('DOMContentLoaded', async () => {
    const jobsContainer = document.getElementById('jobsContainer');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Unauthorized access! Please log in.');
        window.location.href = 'employerLogin.html';
        return;
    }


    const logoutBtn = document.getElementById('logoutBtn');

    // Logout Functionality
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token'); // Clear JWT token
            window.location.href = 'employerLogin.html'; // Redirect to login page
        }
    });


    // Fetch all posted jobs for the employer
    async function fetchPostedJobs() {
        try {
            const response = await fetch('http://localhost:5000/api/employers/createdJobs', {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch posted jobs');

            const jobs = await response.json();
            displayJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            alert('Failed to load posted jobs.');
        }
    }

    // Display the jobs in the container
    function displayJobs(jobs) {
        if (jobs.length === 0) {
            jobsContainer.innerHTML = '<p>No jobs posted yet.</p>';
            return;
        }

        jobsContainer.innerHTML = ''; // Clear existing content

        jobs.forEach((job) => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card', 'p-4', 'bg-white', 'shadow-sm', 'rounded-md', 'mb-4');

            jobCard.innerHTML = `
                <h3 class="text-lg font-semibold">${job.job_title}</h3>
                <p class="text-sm text-gray-600">${job.job_description.substring(0, 100)}...</p>
                <p class="text-sm text-gray-600"><strong>Location:</strong> ${job.location_city}, ${job.location_country}</p>
                <p class="text-sm text-gray-600"><strong>Type:</strong> ${job.job_type}</p>
                <p class="text-sm text-gray-600"><strong>Salary:</strong> ${job.salary_range || 'Not specified'}</p>
                <div class="mt-4 flex space-x-2">
                    <button class="edit-job-btn bg-blue-600 text-white px-4 py-2 rounded" data-job-id="${job.job_id}">Edit</button>
                    <button class="delete-job-btn bg-red-600 text-white px-4 py-2 rounded" data-job-id="${job.job_id}">Delete</button>
                    <button class="view-applicants-btn bg-green-600 text-white px-4 py-2 rounded" data-job-id="${job.job_id}">See Applicants</button>
                </div>
            `;
            jobsContainer.appendChild(jobCard);
        });

        // Attach event listeners to the buttons
        document.querySelectorAll('.edit-job-btn').forEach((btn) =>
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                redirectToEditJob(jobId);
            })
        );

        document.querySelectorAll('.delete-job-btn').forEach((btn) =>
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                deleteJob(jobId);
            })
        );

        document.querySelectorAll('.view-applicants-btn').forEach((btn) =>
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                redirectToApplicantsPage(jobId);
            })
        );
    }

    // Redirect to edit job page
    function redirectToEditJob(jobId) {
        window.location.href = `editJob.html?jobId=${jobId}`;
    }

    // Redirect to applicants page
    function redirectToApplicantsPage(jobId) {
        window.location.href = `applicants.html?jobId=${jobId}`;
    }

    // Delete a job
    async function deleteJob(jobId) {
        if (!confirm('Are you sure you want to delete this job?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/jobs/delete/${jobId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to delete job');
            alert('Job deleted successfully!');
            fetchPostedJobs(); // Reload jobs
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Failed to delete job.');
        }
    }

    fetchPostedJobs(); // Initial fetch
});
