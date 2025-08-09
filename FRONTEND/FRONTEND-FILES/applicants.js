document.addEventListener('DOMContentLoaded', async () => {
    const applicantsContainer = document.getElementById('applicantsContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('jobId');
    const token = localStorage.getItem('token');

    if (!token || !jobId) {
        alert('Unauthorized access or invalid job ID.');
        window.history.back();
        return;
    }

    async function fetchApplicants() {
        try {
            const response = await fetch(`http://localhost:5000/api/employers/applications/${jobId}`, {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to fetch applicants');
            const { applications } = await response.json();
            console.log(applications);
            displayApplicants(applications[0]); // Display the array containing applicants
        } catch (error) {
            console.error('Error fetching applicants:', error);
            applicantsContainer.innerHTML = '<p class="text-red-600">Failed to load applicants.</p>';
        }
    }

    function displayApplicants(applicants) {
        if (!applicants || applicants.length === 0) {
            applicantsContainer.innerHTML = '<p class="text-gray-500">No applicants found for this job.</p>';
            return;
        }

        applicantsContainer.innerHTML = ''; // Clear existing content
        applicants.forEach((applicant) => {
            const card = document.createElement('div');
            card.classList.add('applicant-card', 'bg-white', 'p-4', 'shadow-sm', 'rounded-md');

            card.innerHTML = `
                <h3 class="font-semibold text-lg">${applicant.first_name} ${applicant.last_name}</h3>
                <p><strong>Email:</strong> <a href="mailto:${applicant.email}" class="text-blue-500 hover:underline">${applicant.email}</a></p>
                <p><strong>Education:</strong> ${applicant.education || 'N/A'}</p>
                <p><strong>Experience:</strong> ${applicant.experience || 'N/A'}</p>
                <p><strong>Skills:</strong> ${applicant.skills || 'N/A'}</p>
                <a href="http://localhost:5000/${applicant.cv_file_path}" target="_blank" class="text-blue-600 hover:underline font-semibold mt-4 block">
                    <i class="fas fa-download"></i> View/Download CV
                </a>
            `;

            applicantsContainer.appendChild(card);
        });
    }

    fetchApplicants(); // Load applicants on page load
});
