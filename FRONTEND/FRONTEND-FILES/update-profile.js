document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('update-profile-form');

    // Load existing profile data into the form
    async function loadProfileData() {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'login.html';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch profile');
            }

            const profile = await response.json();

            // Populate form fields
            document.getElementById('first_name').value = profile.first_name || '';
            document.getElementById('last_name').value = profile.last_name || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('bio').value = profile.bio || '';
            document.getElementById('profession').value = profile.profession || '';
            document.getElementById('experience').value = profile.experience || '';
            document.getElementById('education').value = profile.education || '';
            document.getElementById('skills').value = profile.skills || '';
            document.getElementById('profile_picture').value = profile.profile_picture || '';
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Failed to load profile data. Please try again.');
            window.location.href = 'login.html';

        }
    }

    // Handle form submission to update profile
    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const token = localStorage.getItem('token');
        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            phone: document.getElementById('phone').value,
            bio: document.getElementById('bio').value,
            profession: document.getElementById('profession').value,
            experience: document.getElementById('experience').value,
            education: document.getElementById('education').value,
            skills: document.getElementById('skills').value,
            profile_picture: document.getElementById('profile_picture').value,
        };

        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message);
                window.location.href = 'profile.html'; // Redirect to the profile page
            } else {
                alert(result.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again.');
        }
    });

    // Load existing profile data on page load
    loadProfileData();
});
