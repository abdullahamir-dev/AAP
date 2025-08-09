
const apiUrl = 'http://localhost:5000/api/cv/cv'; // Replace with your actual backend endpoint
let isCvUploaded = async ()=>{
    
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
                //window.location.href = 'create-cv.html';
                return;
            }
            // throw new Error('Failed to fetch CV details');
        }
         
        // const data = await response.json();
        // const { full_name, email, phone, country , city , townOrArea , skills, experience, education, field_of_study, cv_file_url } = data.cvDetails;

        
        return true;
       
        
         
        
    } catch (error) {
        console.error('Error fetching CV details:', error);
        //alert(`Failed to load CV details. Please try again later.`);
        return false;
    }

      
}



