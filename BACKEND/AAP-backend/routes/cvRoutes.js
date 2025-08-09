const express = require('express');
const multer = require('multer');
const authMiddleware = require('../middlewares/authMiddleware');
const  {createOrUpdateCV}  = require('../controllers/cvController');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', authMiddleware, upload.single('cv_file'), createOrUpdateCV);


//new code 
const { getCVDetails } = require('../controllers/cvController');
const authenticateToken = require('../middlewares/authMiddleware');
router.get('/cv', authenticateToken, getCVDetails); // Endpoint to fetch CV details



module.exports = router;




 