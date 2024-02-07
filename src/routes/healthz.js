const express = require('express');
const app = express();
app.use(express.json())
const mysql = require('mysql2');
//const router = express.Router();

router.all('/healthz', (req, res, next) => {
    res.header('Cache-Control', 'no-cache');
    if (req.method !== 'GET') {
      return res.status(405).send();
    }
    next()
  });

  router.get('/healthz', async(req, res) => {
    try {
        // Cache-Control header 
        res.header('Cache-Control', 'no-cache');
        // query params
        if (Object.keys(req.query).length > 0) {
            return res.status(400).send();
        }
        // request body
        if (Object.keys(req.body).length > 0) {
            return res.status(400).send();
        }
       
        const isHealthy = await performHealthCheck();

        if (isHealthy) {
            res.status(200).send();
        } else {
            res.status(503).send();
        }

    } catch (error) {
        console.error('Error during health check:', error);
        res.status(500).send();
    }
});


function performHealthCheck() {
    return new Promise((resolve, reject) => {
        try{
            // connecting to MySQL database
            const db = mysql.createConnection({
                host: 'localhost',
                user: 'root',
                password: 'admin@12345'
                });
            db.connect((error) => {
                if (error) {
                    console.error('Error connecting to MySQL database:', error);
                    resolve(false);  
                } else {
                    console.log('Connected to MySQL database!');
                    // closing MySQL connection
                    db.end((endError) => {
                        if (endError) {
                            console.error('Error closing MySQL connection:', endError);
                            reject(endError);  
                        } else {
                            resolve(true);  
                        }
                    });
                }
            });
        }
        catch(error){
            console.log('error');
        }            
    });
   
}

module.exports = router;

