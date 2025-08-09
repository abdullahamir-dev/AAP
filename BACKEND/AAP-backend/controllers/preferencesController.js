const pool = require('../db/connection');
const secretAlgo = require('../controllers/autoApplyAlgo');




// Toggle Auto-Apply Preference
const togglePreference = async (req, res) => {
    let userId = req.user.id;
    
    if(!userId){
        userId = await getUserId(req);
    }
     
    try {
        
        let existingPreference = await initService(userId);
        
        
        
        // Toggle the auto_apply value
        let currentPreference = existingPreference[0].auto_apply; // Access the boolean value directly
        console.log(typeof currentPreference, currentPreference);
        
        if (currentPreference === 1) {
            currentPreference = 0;
        } else {
            currentPreference = 1;
        }
        

        const newPreference = currentPreference; // Updated preference
        
        // Update the preference in the database
        await pool.query('UPDATE UserPreferences SET auto_apply = ? WHERE user_id = ?', [newPreference, userId]);

        if(newPreference === 1){
            //autoApplyCalling()
            await secretAlgo();
        }

        res.status(200).json({ message: 'Preference updated successfully.', auto_apply: newPreference });
    } catch (error) {
        console.error('Error toggling preference:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};



let initService = async (userId)=>{
    
    //Check if a preference record exists for the user
        const [existingPreference] = await pool.query('SELECT auto_apply , is_initialized FROM UserPreferences WHERE user_id = ?', [userId]);

        if (existingPreference.length === 0) {
            //Create a new preference record if none exists
            await pool.query('INSERT INTO UserPreferences (user_id, is_initialized) VALUES (?, ?)', [userId ,   true]);
        }

        return existingPreference;
}



let shouldAvertise = async (req, res) => {
    let userId = req.user.id;

    if (!userId) {
        userId = await getUserId(req);
    }

    console.log(userId);

    let [UserPreference] = await pool.query(
        'SELECT auto_apply, is_initialized FROM UserPreferences WHERE user_id = ?',
        [userId]
    );

    // If no preference exists, initialize it and fetch the new record
    if (UserPreference.length === 0) {
        await initService(userId); // Ensure this step completes
        [UserPreference] = await pool.query(
            'SELECT auto_apply, is_initialized FROM UserPreferences WHERE user_id = ?',
            [userId]
        ); // Fetch the newly initialized preference
    }

    // Evaluate based on the updated UserPreference
    if (UserPreference[0].auto_apply === 1) {
        return res
            .status(200)
            .json({
                message: `Service Shouldn't be advertised for the user & toggle button instantly (on toggle page load) viewed as turned on! ${userId}`
            });
    } else {
        return res
            .status(201)
            .json({
                message: `Service Should be advertised for the user & toggle button instantly (on toggle page load) viewed as turned off! ${userId}`
            });
    }
};




let getUserId = async (req)=>{
    // Retrieve userId from the email in the `users` table

    const userEmail = req.user?.email; // Extract email from the token
        console.log('User Email:', userEmail);

        if (!userEmail) {
            // return res.status(400).json({ message: 'User email not found in the request' });
            console.log("Even email not found");
            return;
        }
    
    const [[userRecord]] = await pool.query(
        'SELECT user_id FROM users WHERE email = ?',
        [userEmail]
    );

    if (!userRecord) {
        return res.status(400).json({ message: 'No user found for the given email' });
    }

    const userId = userRecord.user_id;
    console.log('User ID:', userId);

    return userId;
}


module.exports = { togglePreference , shouldAvertise};



