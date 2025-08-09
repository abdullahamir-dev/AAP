document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'http://localhost:5000/api/cv/cv'; // Replace with your actual backend endpoint
    const downloadBtn = document.getElementById('download-btn');
    
    const token = localStorage.getItem('token');

        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'login.html';
            return;
        }
    

    try {
        // Fetch CV details for the logged-in user
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`, // Adjust token retrieval logic if needed
            },
        });

        if (!response.ok) {
            console.log(response);
            if(response.status == 404) {
                alert("We couldn't found your CV yet!" );
                window.location.href = 'create-cv.html';
                return;
            }
            throw new Error('Failed to fetch CV details');
        }
         
        const data = await response.json();
        const { full_name, email, phone, country , city , townOrArea , skills, experience, education, field_of_study, cv_file_url } = data.cvDetails;

        

        // Populate the fields with data
        document.getElementById('full_name').textContent = full_name;
        document.getElementById('email').textContent = email;
        document.getElementById('phone').textContent = phone;
        document.getElementById('country').textContent = country;
        document.getElementById('city').textContent = city;
        document.getElementById('townOrArea').textContent = townOrArea;
        document.getElementById('skills').textContent = skills;
        document.getElementById('experience').textContent = experience || 'No experience added.';
        document.getElementById('education').textContent = education || 'No education details added.';
        document.getElementById('field_of_study').textContent = field_of_study || 'Not specified.';

        // Handle CV download
        downloadBtn.addEventListener('click', () => {
            window.open(`http://localhost:5000${cv_file_url}`, '_blank');
        });
        
    } catch (error) {
        console.error('Error fetching CV details:', error);
        alert(`Failed to load CV details. Please try again later.`);
    }
});
