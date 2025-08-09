create database autoApplyPro;
use autoApplyPro;

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique identifier for each user
    first_name VARCHAR(50) NOT NULL,        -- First name of the user
    last_name VARCHAR(50) NOT NULL,         -- Last name of the user
    email VARCHAR(100) NOT NULL UNIQUE,     -- Email address (unique to avoid duplicate accounts)
    phone VARCHAR(15) NOT NULL,             -- Phone number
    dob DATE NOT NULL,                      -- Date of birth
    password VARCHAR(255) NOT NULL,         -- Password (hashed for security)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of account creation
);



INSERT INTO users (first_name, last_name, email, phone, dob, password)
VALUES 
('Alice', 'Smith', 'alice.smith@example.com', '1234567890', '1995-05-20', 'hashed_password_1'),
('Bob', 'Johnson', 'bob.johnson@example.com', '9876543210', '1990-10-15', 'hashed_password_2'),
('Charlie', 'Brown', 'charlie.brown@example.com', '4567891230', '1985-08-25', 'hashed_password_3'),
('Diana', 'Prince', 'diana.prince@example.com', '5678901234', '1998-12-11', 'hashed_password_4'),
('Ethan', 'Hunt', 'ethan.hunt@example.com', '7890123456', '1982-03-05', 'hashed_password_5');


SHOW GRANTS FOR 'root'@'localhost';

select * from cvs;

 


delete from users
where user_id = 2;

truncate users;
 
select count(user_id) as TOTALUSER from users;


ALTER TABLE users
ADD COLUMN profession VARCHAR(255),
ADD COLUMN bio TEXT,
ADD COLUMN experience TEXT,
ADD COLUMN education TEXT,
ADD COLUMN skills TEXT,
ADD COLUMN profile_picture TEXT;


update  users
set profession = 'Sr Software & AI Dev' , bio = 'Dedication in AI development!' 
where user_id = 1 ;



CREATE TABLE IF NOT EXISTS cvs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    skills TEXT,
    experience TEXT,
    education TEXT,
    field_of_study VARCHAR(255),
    cv_file_path VARCHAR(255), -- Path to the uploaded file
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);



select * from cvs where user_id = (select user_id from users where email = 'abdullahamir.online@gmail.com' ) ;
select * from users;
alter table cvs
add country varchar(70),
add city varchar(70),
add townOrArea varchar(70);



delete from users where user_id >= 1;

select * from users;


-- Create employers table
CREATE TABLE employers (
    employer_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(15),
    company_name VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    bio TEXT,
    profession VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

select * from jobs;
select * from applications;
select * from employers;

-- Create jobs table
CREATE TABLE jobs (
    job_id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    job_description TEXT NOT NULL,
    job_req_skills TEXT,
    job_req_education TEXT,
    job_type ENUM('Full-time', 'Part-time', 'Internship', 'Contract') DEFAULT 'Full-time',
    salary_range VARCHAR(50),
    location_country VARCHAR(70),
    location_city VARCHAR(70),
    location_town VARCHAR(70),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES employers(employer_id) ON DELETE CASCADE
);

-- Modify users table to add roles (user or employer)
ALTER TABLE users ADD role ENUM('user', 'employer') DEFAULT 'user';
 

-- Create job applications table
CREATE TABLE job_applications (
    application_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    job_id INT NOT NULL,
    application_status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES jobs(job_id) ON DELETE CASCADE
);



SELECT users.user_id, users.email, cvs.skills, cvs.education, cvs.experience, cvs.country, cvs.city, 
             cvs.townOrArea 
             FROM users 
             JOIN cvs ON users.user_id = cvs.user_id 
             JOIN UserPreferences ON users.user_id = UserPreferences.user_id 
             WHERE UserPreferences.auto_apply = true;

alter table applications
add appliedBy varchar(50) DEFAULT "User";
 
update applications
set appliedBy = 'User'
where application_id > 0;


truncate applications;

select * from users where user_id = 19;

SELECT jobs.job_id, jobs.job_title, jobs.job_description, jobs.job_type, jobs.salary_range,
                    jobs.location_country, jobs.location_city, jobs.location_town,
                    employers.company_name, applications.applied_at
             FROM applications
             JOIN jobs ON applications.job_id = jobs.job_id
             JOIN employers ON jobs.employer_id = employers.employer_id
             WHERE applications.user_id = 19
             ORDER BY applications.applied_at DESC;
             
             
             


CREATE TABLE UserPreferences (
    preference_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    auto_apply BOOLEAN DEFAULT false,
    is_initialized BOOLEAN DEFAULT false,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


insert into UserPreferences ( user_id , is_initialized ) values (19  , true);
select * from jobs;

update UserPreferences 
set auto_apply = 0 
where user_id = 24;

select * from UserPreferences ;


drop table  UserPreferences;
select * from UserPreferences as up join cvs as cv on cv.user_id = up.user_id 
where up.auto_apply = 1;

truncate applications;

update applications
set appliedBy = 'AutoApplyPro'
where user_id = 27;


select * from cvs;
select cvs.email as cv_mail,  users.email as profile_mail from cvs 
join users on cvs.user_id = users.user_id 
where users.user_id = 18;
 
select * from users;

select user_id from cvs;