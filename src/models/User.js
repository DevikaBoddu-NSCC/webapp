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
            account_created : Sequelize.DATE,
            account_updated : Sequelize.DATE
            
        },
        {
            createdAt : 'account_created',
            updatedAt : 'account_updated'
        });

        // User.beforeCreate(async (user, options) => {
        //     // Hash the password before creating the user
        //     const hashedPassword = await bcrypt.hash(user.password, 10);
        //     user.password = hashedPassword;
        // });
        
        // User.beforeUpdate(async (user, options) => {
        // // Hash the password before updating the user
        // if (user.changed('password')) {
        //     const hashedPassword = await bcrypt.hash(user.password, 10);
        //     user.password = hashedPassword;
        // }
        // });
        
        // User.sync({ alter: true });
        return User;
    }
    catch (error) {
        console.error('Error creating user:', error);
        res.status(503).send();
    }
    
}

module.exports = model;
