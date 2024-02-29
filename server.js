const express = require('express');
const app = express();
const {createDatabase, sequelize, User} = require('./src/database/database');
const model = require('./src/models/User');
const userController = require('./src/routes/userController');
const healthz = require('./src/routes/healthz');


const PORT = 3000;


app.use(express.json());

async function initializeServer() {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
        // Create the database
        // await createDatabase();
        // Sync the database
        await sequelize.sync({ alter : true})
        console.log('Server initialized successfully');
    } catch (error) {
        console.error('Error initializing server:', error);
    }
}

initializeServer()

app.use(userController);
app.use(healthz);


module.exports = app
