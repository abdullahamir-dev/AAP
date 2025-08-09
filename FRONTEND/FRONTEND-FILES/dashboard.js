 
// Dashboard.js
document.addEventListener('DOMContentLoaded', async function () {
    const token = localStorage.getItem('token'); // Retrieve token from storage

    if (!token) {
        // Redirect to login if no token exists
        alert('Unauthorized access! Please log in.');
        window.location.href = 'LogIn.html';
        return;
    }

    
    await getWelcomeWidgetData(token);
    
    // Decode the token
    const decoded = jwt_decode(token); // Requires jwt-decode library

    // Extract user data (if you encoded it in the token)
    console.log('User data:', decoded);
    //let welcomeMess = `Welcome dear user ${decoded.email}`;

    
    //
    const str = decoded.email;
    const specifiedChar = "@"; // The character you want to stop at
    
    // Find the index of the specified character
    const index = str.indexOf(specifiedChar);
    
    if (index !== -1) {
      // Extract the substring from index 0 to the specified character
      let result = str.slice(0, index);
      console.log(result); // Output: "Hello"
      result = `Welcome, ${result.toUpperCase()}\nYou are Logged In with Email: ${decoded.email}`;
      //alert(result);
    } else {
      console.log("Character not found in the string.");
    }
    
   
    /// AAP alert Logics

    const advertiseAlert = document.getElementById('advertise-alert');
    const closeBtn = document.getElementById('close-advertise');
    const enableAutoApplyBtn = document.getElementById('enable-auto-apply');


    // Fetch the user's preference on page load
    async function fetchPreference() {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Unauthorized access! Please log in.');
            window.location.href = 'LogIn.html';
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/preferences/advertise', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch preference');

            const data = await response.json();

            // Show alert if the user has not enabled auto-apply
            if (response.status == 201) {
                advertiseAlert.classList.remove('hidden');
            }
            else if(response.status == 200){
                advertiseAlert.classList.add('hidden');
                advertiseAlert.style.display = 'none';
            }
             
   
             
        } catch (error) {
            console.error('Error fetching preference:', error);
        }
    }
    


    
    // Close the alert
    closeBtn.addEventListener('click', (event) => {
      advertiseAlert.style.display = 'none';
      advertiseAlert.classList.add('hidden');
    });

    // Enable auto-apply
    enableAutoApplyBtn.addEventListener('click', async () => {
        const token = localStorage.getItem('token');
        if(!( await isCvUploaded())){
           return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/preferences/toggle', {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ enable: true }),
            });
            
            if (!response.ok) throw new Error('Failed to enable auto-apply');
            
            if(response.status == 200){
                advertiseAlert.classList.add('hidden');
                alert('Auto-Apply enabled successfully!');
                advertiseAlert.style.display = 'none';
              }
            else{
                alert("Auto Apply Initialization Failed!");
            }
            
        } catch (error) {
            console.error('Error enabling auto-apply:', error);
        }
    });

  
    


    // Initialize on page load
    fetchPreference();
});




let getWelcomeWidgetData = async (token)=>{
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
        console.log(profile);
        
        
        document.querySelector('#user-name').textContent = `${profile.first_name} ${profile.last_name}`;
        document.querySelector('#user-email').textContent = profile.email;
        document.getElementById("welcome-widget").style.display = 'block';
 
        setTimeout(()=>{
            document.getElementById("welcome-widget").style.display = 'none';
        },5000);
        
        

    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile. Please try again.');  
    }
}