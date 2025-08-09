document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employerProfileForm');
    const logoutBtn = document.getElementById('logoutBtn');

    // Prefill the form with employer profile data
    async function loadProfile() {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'employerLogin.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/employers/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch profile data');

            const profile = await response.json();

            document.getElementById('first_name').value = profile.first_name || '';
            document.getElementById('last_name').value = profile.last_name || '';
            document.getElementById('email').value = profile.email || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('company_name').value = profile.company_name || '';
            document.getElementById('bio').value = profile.bio || '';
            document.getElementById('profession').value = profile.profession || '';
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Failed to load profile.');
        }
    }

    // Submit updated profile data
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const updatedProfile = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            phone: document.getElementById('phone').value,
            company_name: document.getElementById('company_name').value,
            bio: document.getElementById('bio').value,
            profession: document.getElementById('profession').value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/employers/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedProfile),
            });

            if (!response.ok) throw new Error('Failed to update profile');

            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile.');
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to log out?')) {
            localStorage.removeItem('token');
            window.location.href = 'employerLogin.html';
        }
    });

    loadProfile(); // Load profile on page load
});
