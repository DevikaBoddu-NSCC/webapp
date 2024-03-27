// models/User.js
const Sequelize  = require('sequelize');
const bcrypt = require('bcrypt');
const model = (sequelize) => { try {
        const User = sequelize.define('User', {
            id : {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                allowNull: false,
                
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                primaryKey: true,
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            emailSentTime: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            emailVerifiedTime: {
                type: Sequelize.DATE,
                allowNull: true, 
            },
            account_created : Sequelize.DATE,
            account_updated : Sequelize.DATE
            
        },
        {
            createdAt : 'account_created',
            updatedAt : 'account_updated'
        });

        return User;
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(503).send();
    }
    
}

module.exports = model;
