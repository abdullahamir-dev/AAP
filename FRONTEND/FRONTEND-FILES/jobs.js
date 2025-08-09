document.addEventListener('DOMContentLoaded', () => {
    const jobsContainer = document.getElementById('jobsContainer');
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Unauthorized access! Please log in.');
        window.location.href = 'LogIn.html';
        return;
    }

    // Fetch jobs and display
    async function fetchJobs() {
        try {
            const response = await fetch('http://localhost:5000/api/jobs', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch jobs');

            const jobs = await response.json();
            displayJobs(jobs);
        } catch (error) {
            console.error('Error fetching jobs:', error);
            alert('Failed to load jobs.');
        }
    }
    

    function displayJobs(jobs) {
        jobsContainer.innerHTML = ''; // Clear any existing jobs

        if (jobs.length === 0) {
            jobsContainer.innerHTML = '<p class="text-center text-gray-600">No jobs available at the moment.</p>';
            return;
        }

        jobs.forEach((job) => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';

            const applied = job.applied; // Assume this field is returned from API
            jobCard.innerHTML = `
                <h3 class="text-xl font-bold">${job.job_title}</h3>
                <p class="text-gray-700">${job.job_description.substring(0, 150)}...</p>
                <p class="text-sm text-gray-600"><strong>Company:</strong> ${job.company_name}</p>
                <p class="text-sm text-gray-600"><strong>Location:</strong> ${job.location_city}, ${job.location_country}</p>
                <p class="text-sm text-gray-600"><strong>Type:</strong> ${job.job_type}</p>
                <p class="text-sm text-gray-600"><strong>Salary:</strong> ${job.salary_range || 'Not specified'}</p>
                <p class="text-sm text-gray-600"><strong>Skills Required:</strong> ${job.job_req_skills}</p>
                <p class="text-sm text-gray-600"><strong>Education:</strong> ${job.job_req_education}</p>
                <button id="${job.job_id}" class="apply-btn" data-job-id="${job.job_id}" ${applied ? 'disabled' : ''}>
                    ${applied ? 'Already Applied' : 'Apply'}
                </button>
            `;

            jobsContainer.appendChild(jobCard);
        });

        // Add click event listeners for Apply buttons
        document.querySelectorAll('.apply-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                applyForJob(jobId, e.target);
            });
        });
    }

    async function applyForJob(jobId, button) {
        if(!(await isCvUploaded())){
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:5000/api/jobs/${jobId}/apply`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 400) {
                    alert('You have already applied for this job!');
                    alreadyAppliedBtn(button);
                    return;
                }
                throw new Error('Failed to apply for the job');
            }

            alert('Successfully applied for the job!');
            alreadyAppliedBtn(button);
            
        } catch (error) {
            console.error('Error applying for job:', error);
            alert('Failed to apply for the job.');
        }
    }

    // Apply filters
    document.getElementById('applyFilters').addEventListener('click', () => {
        const skills = document.getElementById('filterSkills').value.toLowerCase();
        const education = document.getElementById('filterEducation').value.toLowerCase();
        const location = document.getElementById('filterLocation').value.toLowerCase();

        fetchJobs().then((jobs) => {
            const filteredJobs = jobs.filter((job) => {
                return (
                    (skills && job.job_req_skills.toLowerCase().includes(skills)) ||
                    (education && job.job_req_education.toLowerCase().includes(education)) ||
                    (location && job.location_city.toLowerCase().includes(location))
                );
            });
            displayJobs(filteredJobs);
        });
    });

    fetchJobs(); // Initial fetch
});


let alreadyAppliedBtn = (button)=>{
            button.innerText = 'Already Applied';
            button.disabled = true;
            button.classList.add('bg-gray-400', 'cursor-not-allowed');
            button.classList.remove('bg-blue-600');
}

