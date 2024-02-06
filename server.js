const express = require('express');
const app = express();
const {createDatabase, sequelize} = require('./src/database/database');
const model = require('./src/models/User');
const userController = require('./src/routes/userController');
const healthz = require('./src/routes/healthz');
const PORT = 3000;

app.use(express.json());

async function initializeServer() {
    try {
        // Create the database
        await createDatabase();
        // Sync the database
        const User = model(sequelize);
        console.log('Server initialized successfully');
    } catch (error) {
        console.error('Error initializing server:', error);
    }
}
app.use(userController);
app.use(healthz);
initializeServer()


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app
