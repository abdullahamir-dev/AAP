document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('employerSignupForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const firstName = document.getElementById('first_name').value;
        const lastName = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const companyName = document.getElementById('company_name').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        const payload = {
            first_name: firstName,
            last_name: lastName,
            email: email,
            phone: phone,
            company_name: companyName,
            password: password,
        };

        try {
            const response = await fetch('http://localhost:5000/api/employers/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message || 'Registration successful!');
                window.location.href = 'employerLogin.html';
            } else {
                throw new Error(data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error registering employer:', error);
            alert('Failed to register. Please try again.');
        }
    });
});
