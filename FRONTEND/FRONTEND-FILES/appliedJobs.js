document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.getElementById('jobsContainer');
    const modal = document.getElementById('jobDetailsModal');
    const closeModalBtn = document.getElementById('closeModal');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Unauthorized access! Please log in.');
        window.location.href = 'login.html';
        return;
    }

    // Fetch applied jobs
    async function fetchAppliedJobs() {
        try {
            const response = await fetch('http://localhost:5000/api/jobs/applied', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch applied jobs');
            
            const { jobs } = await response.json();
            displayAppliedJobs(jobs);
        } catch (error) {
            console.error('Error fetching applied jobs:', error);
            alert('Failed to load applied jobs.');
        }
    }

    // Display jobs
    function displayAppliedJobs(jobs) {
        jobsContainer.innerHTML = '';

        if (!Array.isArray(jobs) || jobs.length === 0) {
            jobsContainer.innerHTML = '<p>No applied jobs found.</p>';
            return;
        }

        jobs.forEach((job) => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';

            jobCard.innerHTML = `
                <h3>${job.job_title}</h3>
                <p>${job.job_description.substring(0, 100)}...</p>
                <p><strong>Company:</strong> ${job.company_name}</p>
                <p><strong>Location:</strong> ${job.location_city}, ${job.location_country}</p>
                <p  style = "color:white;"><strong>Applied By:</strong> ${job.appliedBy || 'You'}  </p>
                <button class="view-details-btn" data-job-id="${job.job_id}">View Details</button>
            `;

            jobsContainer.appendChild(jobCard);
        });

        document.querySelectorAll('.view-details-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                fetchJobDetails(jobId);
            });
        });
    }

    // Fetch and display job details
    async function fetchJobDetails(jobId) {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch job details');

            const job = await response.json();
            showModal(job);
        } catch (error) {
            console.error('Error fetching job details:', error);
            alert('Failed to load job details.');
        }
    }

    // Show modal with job details
    function showModal(job) {
        document.getElementById('modalJobTitle').textContent = job.job_title;
        document.getElementById('modalJobDescription').textContent = job.job_description;
        document.getElementById('modalJobDetails').innerHTML = `
            <p><strong>Type:</strong> ${job.job_type}</p>
            <p><strong>Salary:</strong> ${job.salary_range || 'Not specified'}</p>
            <p><strong>Location:</strong> ${job.location_city}, ${job.location_country}</p>
         `;
        document.getElementById('modalCompany').textContent = `Company: ${job.company_name}`;
        modal.classList.remove('hidden');
    }

    // Close modal
    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    fetchAppliedJobs(); // Load applied jobs on page load
});
