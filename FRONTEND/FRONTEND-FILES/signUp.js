// Get the form element
const signupForm = document.getElementById("signupForm");

// Add an event listener for form submission
signupForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Get form values
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;

    // Check if passwords match
    if (password !== confirm_password) {
        alert("Passwords do not match!");
        return;
    }

    // Prepare data for API call
    const userData = {
        first_name,
        last_name,
        email,
        phone,
        dob,
        password,
        confirm_password
    };

    try {
        // Send a POST request to the registration API
        const response = await fetch("http://localhost:5000/api/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        // Handle response
        const data = await response.json();
        if (response.ok) {
            alert("Registration successful!");
            // Redirect to another page (e.g., login page)
            window.location.href = "LogIn.html";
        } else {
            // Show error message from API
            alert(data.message || "Registration failed!");
        }
    } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while registering. Please try again later.");
    }
});
