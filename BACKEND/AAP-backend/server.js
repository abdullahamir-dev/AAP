const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const cvRoutes = require('./routes/cvRoutes'); // Import CV routes

const  secretAlgo  = require('./controllers/autoApplyAlgo');
const preferencesRoutes = require('./routes/preferencesRoutes');


 

const employerRoutes = require('./routes/employerRoutes');
const jobRoutes = require('./routes/jobRoutes');



require('dotenv').config(); // Ensure you load environment variables

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Support form submissions

app.use('/api/users', userRoutes); // Load user routes
app.use('/api/auth', authRoutes); // New auth routes
app.use('/api/cv', cvRoutes); // Mount CV routes



 
const path = require('path');

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));





app.use('/api/employers', employerRoutes); // Employer routes
app.use('/api/jobs', jobRoutes);           // Job routes






// app.get('/test', (req, res) => {
//     res.json({ message: `${secretAlgo()}` });
// });

 



app.use('/api/preferences', preferencesRoutes);  //Preference Routes







 
 

// Schedule the algorithm to run at midnight (00:00 daily)
cron.schedule('0 0 * * *', async () => {
    console.log('Running Auto Apply Algorithm at Midnight...');
    try {
        await secretAlgo();
        console.log('Auto Apply Algorithm executed successfully');
    } catch (err) {
        console.error('Error running Auto Apply Algorithm:', err);
    }
});

 



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


 


 
