document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employerLoginForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const payload = {
            email: email,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:5000/api/employers/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Login successful!');
                localStorage.setItem('token', data.token); // Store JWT token
                window.location.href = 'employerDashboard.html'; // Redirect to employer dashboard
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Error logging in employer:', error);
            alert('Failed to log in. Please try again.');
        }
    });
});
