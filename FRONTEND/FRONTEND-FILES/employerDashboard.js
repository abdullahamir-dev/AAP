document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logoutBtn');

    // Logout Functionality
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token'); // Clear JWT token
            window.location.href = 'employerLogin.html'; // Redirect to login page
        }
    });

    // Example: Fetch employer's posted jobs (if needed on the dashboard)
    async function loadEmployerMiniInfo() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'employerLogin.html';
            return;
        }

        // try {
        //     const response = await fetch('http://localhost:5000/api/employers/jobs', {
        //         headers: {
        //             Authorization: `Bearer ${token}`,
        //         },
        //     });

        //     const jobs = await response.json();
        //     if (!response.ok) throw new Error(jobs.message || 'Failed to load jobs');

        //     console.log('Posted Jobs:', jobs); // Handle jobs data (e.g., render in the UI)
        // } catch (error) {
        //     console.error('Error loading jobs:', error);
        // }

        try {
            const response = await fetch('http://localhost:5000/api/employers/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch profile data');

            const profile = await response.json();

            document.getElementById('welcome-clause-name').innerText = `${profile.first_name} ${profile.last_name}` || 'Employer Full Name!';
            // document.getElementById('last_name').value = profile.last_name || '';
            document.getElementById('welcome-clause-email').innerText = profile.email || 'Employer Email';
            // document.getElementById('phone').value = profile.phone || '';
            // document.getElementById('company_name').value = profile.company_name || '';
            // document.getElementById('bio').value = profile.bio || '';
            // document.getElementById('profession').value = profile.profession || '';
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Failed to load profile.');
        }


    }

    // Uncomment if jobs need to be displayed
    //loadPostedJobs();

     
    //load employer's mini info
    loadEmployerMiniInfo();


});
