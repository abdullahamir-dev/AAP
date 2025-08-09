document.addEventListener('DOMContentLoaded', async () => {
    const editJobForm = document.getElementById('editJobForm');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    const token = localStorage.getItem('token');

    if (!token || !jobId) {
        alert('Unauthorized or invalid job ID.');
        window.location.href = 'viewJobs.html';
        return;
    }

    // Fetch job details and prefill the form
    async function loadJobDetails() {
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch job details');
            const job = await response.json();
            prefillForm(job);
        } catch (error) {
            console.error('Error loading job details:', error);
            alert('Failed to load job details.');
        }
    }

    function prefillForm(job) {
        document.getElementById('job_title').value = job.job_title;
        document.getElementById('job_description').value = job.job_description;
        document.getElementById('job_req_skills').value = job.job_req_skills;
        document.getElementById('job_req_education').value = job.job_req_education;
        document.getElementById('job_type').value = job.job_type;
        document.getElementById('salary_range').value = job.salary_range;
        document.getElementById('location_country').value = job.location_country;
        document.getElementById('location_city').value = job.location_city;
        document.getElementById('location_town').value = job.location_town;
    }

    editJobForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const updatedJob = {
            job_title: document.getElementById('job_title').value,
            job_description: document.getElementById('job_description').value,
            job_req_skills: document.getElementById('job_req_skills').value,
            job_req_education: document.getElementById('job_req_education').value,
            job_type: document.getElementById('job_type').value,
            salary_range: document.getElementById('salary_range').value,
            location_country: document.getElementById('location_country').value,
            location_city: document.getElementById('location_city').value,
            location_town: document.getElementById('location_town').value,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/jobs/update/${jobId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedJob),
            });

            if (!response.ok) throw new Error('Failed to update job');
            alert('Job updated successfully!');
            window.location.href = 'viewJobs.html';
        } catch (error) {
            console.error('Error updating job:', error);
            alert('Failed to update job.');
        }
    });

    loadJobDetails(); // Load job details on page load
});
