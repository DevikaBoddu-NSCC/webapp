// userController.js
const express = require('express');
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../database/database');
const userModel = require('../models/User');
const logger = require('../../logger');
const { PubSub } = require('@google-cloud/pubsub');
const pubSubClient = new PubSub({
    apiEndpoint: 'us-east1-pubsub.googleapis.com:443',
    projectId: 'dev-csye6225-415809',
  });

const router = express.Router();

router.post('/v1/user', async (req, res) => {
    try {
        const { first_name, last_name, password, username, account_created, account_updated  } = req.body;

        if ( account_created || account_updated)  {
            logger.warn('Authentication failed: User is forbidden to update account_created or account_updated details.', {severity : "warn"});
            return res.status(403).json({ error: 'User is forbidden to update account_created or account_updated details.' });
        }
        if (!first_name || !last_name || !password || !username) {
            logger.warn('400: Bad request', {severity : "warn"});
            return res.status(400).send();
        }

        if (!username || !isValidEmail(username)) {
            logger.warn('400 Bad request: Invalid email address', {severity : "warn"});
            return res.status(400).json({ error: 'Invalid email address' });
        }

        const existingUser = await userModel(sequelize).findOne({
            where: {
                username: username,
            },
        });

        if (existingUser) {
            logger.warn('400 Bad request: User with this email already exists', {severity : "warn"});
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const user = await userModel(sequelize).create({
            first_name,
            last_name,
            password : hashedPassword,
            username,
        })

        await publishMessage(username, user.id);

        const userResponse = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            username: user.username,
            account_created: user.account_created,
            account_updated: user.account_updated,
        };
        logger.info('201 Created: User Created successfully');
        res.status(201).json(userResponse);
    } catch (error) {
        logger.error('503 Service Unavailable - Error creating user', {severity : "error"});
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
            logger.warn('401 Unauthorized', {severity : "warn"});
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const base64Credentials = authHeader.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
        const [email, oldpassword] = credentials.split(':');
    
        const { first_name, last_name, password, username, account_created, account_updated } = req.body;
 
        const user = await userModel(sequelize).findOne({ where: { username: email } });

        if (!user) {
            logger.warn('404 User not found', {severity : "warn"});
            return res.status(404).json({ error: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const passwordMatch = await bcrypt.compare(oldpassword, user.password);

        if (!passwordMatch) {
            logger.warn('401 Unauthorized user', {severity : "warn"});
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        if ( username ) {
            logger.warn('400 Bad request : Username cannot be updated', {severity : "warn"});
            return res.status(400).json({ error: 'You cannot update username.' });
        }
        if ( account_created || account_updated)  {
            logger.warn('403 Forbidden error: User is forbidden to update account_created or account_updated details', {severity : "warn"});
            return res.status(403).json({ error: 'User is forbidden to update account_created or account_updated details.' });
        }
        
        if (!first_name || !last_name || !password ) {
            logger.warn('400 Bad request', {severity : "warn"});
            return res.status(400).send();
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
        logger.info('204 No Content');
        return res.status(204).send();
    } catch (error) {
        logger.error('503 Service Unavailable',{severity : "error"});
        console.error(error);
        return res.status(503).json({ error: 'Service Unavailable' });
    }
});


router.get('/v1/user/self', async (req, res) => {
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        logger.warn('401 Unauthorized', {severity : "warn"});
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
            logger.warn('404 User not found', {severity : "warn"});
            return res.status(404).json({ error: 'User not found' });
        }
        if(user.isVerified == 0){
            return res.status(404).json({ error: 'Please verify email address' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            logger.warn('401 Unauthorized user', {severity : "warn"});
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
        logger.info('200 OK');
        return res.status(200).json({ userResponse });
        }
        catch(error){
            logger.error('503 Service Unavailable', {severity : "error"});
            return res.status(503).json({ message: 'Service Unavailable'});
        }
});

router.get('/verify-auth/:id', async(req, res) => {

    const authHeader = req.headers['authorization'];
    
    if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    const { id } = req.params;
    try{

        const user = await userModel(sequelize).findOne({ where: { username } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Unauthorized user' });
        }

        //emailSentTime - get from Cloud SQL
        if(!user.emailSentTime) {
            return res.status(400).send('Verification is not successful');
        }

        const currentTime = new Date();
        const timeDiff = currentTime - new Date(user.emailSentTime);
        
        if(timeDiff <= 12000){
            user.isVerified = true;
            user.emailVerifiedTime = currentTime;

            await user.save();
            return res.send('Verification successful');
        }else{
            return res.status(400).send('Verification not successful(link expired)');
        }


            
        
    }catch(error){
        res.status(500).send('Error during email verification');
    }
});

async function publishMessage(email, uuid) {
    const data = {
        email: email,
        uuid: uuid
    };
    const dataBuffer = Buffer.from(JSON.stringify(data));
    const publishOptions = {
        messageOrdering: true,
    };
    const customAttributes = {
        origin: 'nodejs-sample',
        username: 'gcp',
    };
    try {
        await pubSubClient.topic('verify_email_1',publishOptions).publishMessage({data: dataBuffer, attributes: customAttributes});
        console.log('Message published successfully');
    } catch (error) {
        console.error('Error publishing message:', error);
    }
}




module.exports = router;

