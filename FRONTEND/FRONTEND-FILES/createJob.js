document.addEventListener('DOMContentLoaded', () => {



    const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'employerLogin.html';
            return;
        }

    const form = document.getElementById('createJobForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Handle job creation form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'employerLogin.html';
            return;
        }

        const newJob = {
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
            const response = await fetch('http://localhost:5000/api/jobs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newJob),
            });

            if (!response.ok) throw new Error('Failed to create job');

            alert('Job created successfully!');
            form.reset();
        } catch (error) {
            console.error('Error creating job:', error);
            alert('Failed to create job. Please try again.');
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token');
            window.location.href = 'employerLogin.html';
        }
    });
});
