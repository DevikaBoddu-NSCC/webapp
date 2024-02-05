// userController.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sequelize } = require('../database/database');
const userModel = require('../models/User');

const router = express.Router();

// POST route to add a user
router.post('/users', async (req, res) => {
    try {
        const { first_name, last_name, password, username } = req.body;
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
            username: user.username, // Using email as the username
            account_created: user.account_created,
            account_updated: user.account_updated,
        };

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send();
    }
});


router.put('/users/self', async (req, res) => {

    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [email, password] = credentials.split(':');

    console.log(email, password);
    try {
        // Find the user by email
        const user = await userModel(sequelize).findOne({ where: { email } });
        console.log(user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log(password, user.password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Incorrect password' });
        }

        const { firstname, lastname, newpassword } = req.body;

        if (firstname) {
            user.firstname = firstname;
        }
        if (lastname) {
            user.lastname = lastname;
        }

        if(newpassword){
            user.password = newpassword;
        }
        // Save the updated user
        await user.save();

        return res.status(200).json({ message: 'User details updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;
