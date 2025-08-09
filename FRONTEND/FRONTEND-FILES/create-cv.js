

const downloadBtn = document.getElementById('download-btn');
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('cv-form');

    // Prefill the form with user profile data
    async function loadPreSavedData() {
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'login.html';
            return;
        }

        
        if(( await isCvUploaded())){
            if((await loadUploadedCvData())){
                 return;
            }
        }
         
        
    
        try {
            const response = await fetch('http://localhost:5000/api/users/profile', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Failed to fetch profile data');

            const profile = await response.json();

            document.getElementById('full_name').value = `${profile.first_name} ${profile.last_name}` || '';
            document.getElementById('email').value = profile.email || '';
            document.getElementById('phone').value = profile.phone || '';
            document.getElementById('skills').value = profile.skills || '';
            document.getElementById('experience').value = profile.experience || '';
            document.getElementById('education').value = profile.education || '';
            document.getElementById('field_of_study').value = profile.profession || '';
        } catch (error) {
            console.error('Error loading profile:', error);
            alert('Failed to load profile data.');
        }
    }

    // Submit form data and upload CV file
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'login.html';
            return;
        }

        const formData = new FormData();
        formData.append('full_name', document.getElementById('full_name').value);
        formData.append('email', document.getElementById('email').value);
        formData.append('phone', document.getElementById('phone').value);
        formData.append('country', document.getElementById('country').value);
        formData.append('city', document.getElementById('city').value);
        formData.append('townOrArea', document.getElementById('townOrArea').value);
        formData.append('skills', document.getElementById('skills').value);
        formData.append('experience', document.getElementById('experience').value);
        formData.append('education', document.getElementById('education').value);
        formData.append('field_of_study', document.getElementById('field_of_study').value);
        formData.append('cv_file', document.getElementById('cv_file').files[0]);

        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Uploading...';

        try {
            const response = await fetch('http://localhost:5000/api/cv', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Failed to upload CV');

            alert(result.message || 'CV submitted successfully!');
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Error uploading CV:', error);
            alert('Failed to upload CV. Please try again.');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Submit';
        }
    });

    loadPreSavedData();
});





let loadUploadedCvData = async ()=>{

        const apiUrl = 'http://localhost:5000/api/cv/cv'; // Replace with your actual backend endpoint
        // const downloadBtn = document.getElementById('download-btn');
        
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
            const { full_name, email, phone, country , city , townOrArea , skills, experience, education, field_of_study, cv_file_url} = data.cvDetails;
    
            
    
            // Populate the fields with data
            document.getElementById('full_name').value = `${full_name}` || '';
            document.getElementById('email').value =  email || '';
            document.getElementById('phone').value =  phone || '';
            document.getElementById('country').value =  country || '';
            document.getElementById('city').value =  city || '';
            document.getElementById('townOrArea').value =  townOrArea || '';
            document.getElementById('skills').value =  skills || '';
            document.getElementById('experience').value =  experience || '';
            document.getElementById('education').value =  education || '';
            document.getElementById('field_of_study').value = field_of_study || '';
            const cvDownloadBtn = document.getElementById("cv-download-btn");
            
            
            if(cv_file_url){
                cvDownloadBtn.style.display = "block";
            }
            
            
             // Optional: Add download functionality if you want users to download the existing file
             downloadBtn.addEventListener('click', () => {
              window.open(`http://localhost:5000${cv_file_url}`, '_blank');
             });
  
             
            
            
            return true;
            
        } catch (error) {
            console.error('Error fetching CV details:', error);
            alert(`Failed to load CV details. Please try again later.`);

            return false;
        }
   
    
}
