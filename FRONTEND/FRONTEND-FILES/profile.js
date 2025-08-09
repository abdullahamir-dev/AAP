document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('Please log in to access your dashboard');
        window.location.href = 'Login.html';
        return;
    }

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
        // Populate the profile fields
        document.querySelector('.profile-name').textContent = `${profile.first_name} ${profile.last_name}`;
        //document.querySelector('.profile-email').textContent = profile.email;
        //document.querySelector('.profile-phone').textContent = profile.phone || 'N/A';
        document.querySelector('.profile-bio').textContent = profile.bio || 'No bio available.';
        document.querySelector('.profile-profession').textContent = profile.profession || 'Not specified';
        document.querySelector('.profile-experience').textContent = profile.experience || 'No experience provided';
        document.querySelector('.profile-education').textContent = profile.education || 'No education details';
        document.querySelector('.profile-skills').textContent = profile.skills || 'No skills added';
        document.querySelector('.profile-picture').src =   'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3467.jpg?w=740' ;
    } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile. Please try again.');
    }
});



let editProfileBtn  = document.getElementById("edit.profile-btn");
editProfileBtn.addEventListener('click',()=>{
    window.location.href = 'update-profile.html';
});



//imgDirectLinkConverting

// function convertToDirectLink(driveLink) {
//     const fileIdMatch = driveLink.match(/id=([\w-]+)/);
//     if (fileIdMatch && fileIdMatch[1]) {
//         return `https://drive.google.com/uc?id=${fileIdMatch[1]}`;
//     }
//     return null; // Return null if the link is invalid
// }

// Example usage
// const submittedLink = "https://drive.google.com/open?id=18PAAL7pjoptZa7siLG8uglH2QpjJS1_l";
// const directLink = convertToDirectLink(submittedLink);

// if (directLink) {
//     console.log("Direct Link:", directLink);
//     // Set the direct link to the <img> tag
//     document.getElementById("client-image").src = directLink;
// } else {
//     console.error("Invalid Google Drive link");
// }
