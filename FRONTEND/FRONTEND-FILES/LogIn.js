// Login.js

document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.querySelector('form'); // Select the form

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Prevent default form submission

        // Capture email and password input values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();

        // Basic input validation
        if (!email || !password) {
            alert('Please enter both email and password');
            return;
        }

        try {
            // Send POST request to the login API
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json(); // Parse the JSON response

            if (response.ok) {
                // Login successful
                alert('Login successful!');
                
                // Save token (if provided) to localStorage/sessionStorage
                localStorage.setItem('token', data.token);

                // Redirect to the dashboard/home page
                window.location.href = 'dashboard.html';
            } else {
                // Handle errors (e.g., wrong credentials, server issues)
                alert(data.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again later.');
        }
    });
});
