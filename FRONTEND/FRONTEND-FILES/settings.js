document.addEventListener('DOMContentLoaded',  function () {
    const token = localStorage.getItem('token'); // Retrieve token from storage

    if (!token) {
        // Redirect to login if no token exists
        alert('Unauthorized access! Please log in.');
        window.location.href = 'LogIn.html';
        return;
    }

    let autoApplySatus;

    let autoApplyBtn = document.getElementById("auto-apply-btn");
    autoApplyBtn.addEventListener('click' , async ()=>{
        if(!(await isCvUploaded())){
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
                if(autoApplySatus === "Enabled"){
                  autoApplyBtn.innerText = 'Enable Auto Apply';
                  alert("You have successfully disabled autoapply!");
                  autoApplySatus = "Disabled";
                }
                else{
                    autoApplyBtn.innerText = 'Disable Auto Apply';
                    alert("You have successfully enabled autoapply!");
                    autoApplySatus = "Enabled"; 
                }
              }
            else{
                autoApplyBtn.innerText = 'Enable Auto Apply';
                alert("Something went wrong!");

            }
            
        } catch (error) {
            console.error('Error enabling auto-apply:', error);
        }
    });


    let getAAPStatus = async ()=>{
        try {
            const response = await fetch('http://localhost:5000/api/preferences/advertise', {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            if (!response.ok) throw new Error('Failed to fetch preference');
    
            const data = await response.json();
    
            // Show alert if the user has not enabled auto-apply
            if (response.status == 201) {
                autoApplyBtn.innerText = 'Enable Auto Apply';
                autoApplySatus = "Disabled" ;
            }
            else if(response.status == 200){
                autoApplyBtn.innerText = 'Disable Auto Apply';
                autoApplySatus = "Enabled" ;
            }
             
        
             
        } catch (error) {
            console.error('Error fetching preference:', error);
        }
    }


    getAAPStatus();

});