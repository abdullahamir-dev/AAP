# AutoApplyPro

**AutoApplyPro** is a cross-platform job application system designed to automate the application process, intelligently matching candidates to job postings and applying on their behalf.  
Its core innovation is the **Auto-Apply Algorithm**, which analyzes both user profile data and uploaded resume content to determine the best job matches.

Currently in **active development**, the system focuses on the MVP stage, implementing the backend intelligence and essential UI, with scope for UI refinements, resume template customization, and deployment as a unique job automation service in the future.

---

## 🚀 Features (MVP)

- **Auto-Apply Job Applications** – Automatically applies to matching job postings once a threshold match score is reached.
- **Weighted Job Matching Algorithm** – Compares candidate skills, education, and location with job requirements.
- **Form-Based Resume Input** – Users fill out structured resume fields and can upload an external CV file (PDF or other generic file types).
- **Client-Server Architecture** – Decoupled frontend and backend communicating via REST APIs.
- **MySQL Database Integration** – Stores user data, job postings, and application history securely.
- **Duplicate Prevention** – Ensures the system does not re-apply for the same job for the same user.

---

## 🧠 High-Level Algorithm Overview

The **Auto-Apply Algorithm** is the heart of AutoApplyPro.  
It works as follows:

1. **User Data Collection**  
   - Users enter resume details via form fields (skills, education, experience, location, etc.)  
   - Users can also upload a CV file in PDF or other formats.  
   - Currently, no customizable resume templates are offered — this is planned for later phases.

2. **Job Data Fetching**  
   - The system fetches all active job postings from the database, each containing required skills, education, and location details.

3. **Matching Process**  
   - **Skills Matching:** Compares user skills with job-required skills, using a minimum match count to qualify.
   - **Education Matching:** Compares user education level/keywords to job-required education.
   - **Location Matching:** Assigns weighted scores depending on match level (country, city, town). Remote jobs get a full score automatically.

4. **Weighted Scoring**  
   - Each category (skills, education, location) contributes a weight to the total score.
   - Example: Skills (1 point if matched), Education (1 point if matched), Location (0–1 point depending on proximity).
   - If the **total score meets or exceeds a defined threshold**, the system proceeds to auto-apply.

5. **Application Submission**  
   - Applications are created in the database with metadata (job ID, user ID, CV file path, applied method, timestamp).
   - Duplicate checks ensure the same job is not applied to more than once for the same user.

---

## 🛠 Tech Stack

- **Frontend:** HTML, CSS, JavaScript (local development server)
- **Backend:** Node.js, Express.js
- **Database:** MySQL
- **Architecture:** Modular client-server with API communication

---

## 📂 Project Setup Instructions

After pulling or extracting the project directory, you will see two main folders:

FRONTEND/ # Root directory for the frontend server
BACKEND/ # Contains backend server files and database file


### 1. Frontend Setup
- Navigate to the `FRONTEND` folder.
- Open it in your code editor (e.g., VS Code).
- This folder contains the root files for the frontend server.

### 2. Backend Setup
Inside the `BACKEND` folder, you will find:
- `AAP-backend/` → Root directory for backend (Node.js + Express) server files.
- `db.sql` (or similar) → SQL database file.

Open the `AAP-backend` folder in your code editor for backend development.

### 3. Database Configuration
- Import the SQL file from the `BACKEND` folder into your MySQL server (e.g., using phpMyAdmin or MySQL Workbench).
- Create a local MySQL instance with:
  - **User:** `root`
  - **Password:** *(your local MySQL password)*
- Open the `.env` file inside the `AAP-backend` folder and update the database credentials accordingly:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=your_database_name



### 4. Run the Application

#### Backend:
```bash
cd BACKEND/AAP-backend
npm install
npm start



Frontend:
Navigate to the FRONTEND folder.
Open index.html directly in your browser or use a local server.
Note: Ensure both the frontend and backend are running for the application to function correctly.



📌 Status
Current Focus: Backend intelligence and core auto-apply functionality.

Pending Improvements:
Customizable resume templates in the Resume Builder.
Advanced parsing of uploaded CV files for richer matching.
Additional job data sources.
UI enhancements for a smoother user experience.



📝 License
This project is intended for educational and demonstration purposes.
Future iterations may evolve into a deployable SaaS platform.
