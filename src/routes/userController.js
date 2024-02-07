// userController.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sequelize } = require('../database/database');
const userModel = require('../models/User');

const router = express.Router();

router.post('/v1/user', async (req, res) => {
    try {
        const { first_name, last_name, password, username, account_created, account_updated  } = req.body;

        if ( account_created || account_updated)  {
            return res.status(403).json({ error: 'User is forbidden to update account_created or account_updated details.' });
        }
        if (!first_name || !last_name || !password || !username) {
            return res.status(400).json({ error: 'Field values cannot be null' });
        }

        if (!username || !isValidEmail(username)) {
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const existingUser = await userModel(sequelize).findOne({
            where: {
                username: username,
            },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await userModel(sequelize).create({
            first_name,
            last_name,
            password : hashedPassword,
            username,
        });

        const userResponse = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated,
        };

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(503).send();
    }
});
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

router.put('/v1/user/self', async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, oldpassword] = credentials.split(':');
    
        const { first_name, last_name, password, username, account_created, account_updated } = req.body;
 
        const user = await userModel(sequelize).findOne({ where: { username: email } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const passwordMatch = await bcrypt.compare(oldpassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        if ( username ) {
            return res.status(400).json({ error: 'You cannot update username.' });
        }
        if ( account_created || account_updated)  {
            return res.status(403).json({ error: 'User is forbidden to update account_created or account_updated details.' });
        }
        
        if (!first_name || !last_name || !password ) {
            return res.status(400).json({ error: 'Field values cannot be null.' });
        }
        if (first_name) {
            user.first_name = first_name;
        }
        if (last_name) {
            user.last_name = last_name;
        }

        if(password){
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(503).json({ error: 'Service Unavailable' });
    }
});


router.get('/v1/user/self', async (req, res) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    try {
        // Find the user by email
        const user = await userModel(sequelize).findOne({ where: { username } });
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Unauthorized user' });
        }
        const userdetails = await userModel(sequelize).findOne({
            where: {
                username: username,
            },
        });
        const userResponse = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username, 
            account_created: user.account_created,
            account_updated: user.account_updated,
        };
        return res.status(200).json({ message: 'User details : ', userResponse });
        }
        catch(error){
            return res.status(503).json({ message: 'Service Unavailable'});
        }
});


module.exports = router;

