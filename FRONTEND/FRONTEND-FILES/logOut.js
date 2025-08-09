document.getElementById('logout-button').addEventListener('click', function () {
    // Show a professional alert to notify the user
    alert('You have been logged out.');

    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Notify other tabs or windows about the logout for synchronization
    localStorage.setItem('logout-event', Date.now());

    // Redirect the user to the login page
    window.location.href = 'login.html';
});

// Synchronize logout across all tabs/windows
window.addEventListener('storage', function (event) {
    if (event.key === 'logout-event') {
        // Prevent unauthorized access alerts in other tabs by redirecting silently
        if (!localStorage.getItem('token')) {
            window.location.href = 'login.html';
        }
    }
});

// Global error handler to avoid showing unauthorized access alerts unnecessarily
window.addEventListener('error', function (event) {
    // Check if the error relates to unauthorized access
    if (event.message && event.message.includes('Unauthorized')) {
        // Prevent default alert for the error
        event.preventDefault();
    }
});
