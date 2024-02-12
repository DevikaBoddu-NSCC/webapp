const assert = require('assert');
const request = require('supertest');
const app = require('../../server'); 
const { sequelize } = require('../database/database');
const userModel = require('../models/User');
describe('/v1/user endpoint', () => {
    let allTestsPassed = true;
    describe('POST /v1/user', () => {
        try{
            it('should create a new user', async () => {
                const userData = {
                    first_name: 'dev',
                    last_name: 'bod',
                    username: 'dev4@gmail.com',
                    password: 'password123'
                };

                setTimeout(async () => {
                    const response = await request(app)
                    .post('/v1/user')
                    .send(userData)
                    .expect(201);
                    // Additional assertions to check response body
                    expect(response.body).to.have.property('id');
                    expect(response.body.first_name).to.equal(userData.first_name);
                    // Add more assertions as needed
                }, 1000); // Adjust the delay time as needed (in milliseconds)

            });
        }catch (error) {
            console.error(error);
            allTestsPassed = false;
        }

        
    });

describe('GET /v1/user/self', () => {
    try{
        it('should retrieve user information', async () => {
            const authHeader = Buffer.from('dev4@gmail.com:password123').toString('base64');

            const response = await request(app)
                .get('/v1/user/self')
                .set('Authorization', `Basic ${authHeader}`)
                .expect(200); 

            
            assert(response.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
            assert(response.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
            assert.strictEqual(response.body.userResponse.first_name, 'dev', 'First name should match');
            assert.strictEqual(response.body.userResponse.last_name, 'bod', 'Last name should match');
            assert.strictEqual(response.body.userResponse.username, 'dev4@gmail.com', 'Username should match');
        });
    }catch (error) {
        console.error(error);
        allTestsPassed = false;
    }
});

describe('PUT /v1/user/self', () => {

    it('should update user information', async () => {
        try{
            const authHeader = Buffer.from('dev4@gmail.com:password123').toString('base64');
            it('should create a new user', async () => {
                const userData = {
                    first_name: 'dev1',
                    last_name: 'bod1',
                    password: 'password123'
                };

                setTimeout(async () => {
                    const response = await request(app)
                    .put('/v1/user/self')
                    .set('Authorization', `Basic ${authHeader}`)
                    .send(userData)
                    .expect(204);
                
                    expect(response.body).to.have.property('id');
                    expect(response.body.first_name).to.equal(userData.first_name);
                
                }, 1000); 

                assert(response.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                assert(response.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
                assert.strictEqual(response.body.userResponse.first_name, 'dev1', 'First name should match');
                assert.strictEqual(response.body.userResponse.last_name, 'bod1', 'Last name should match');
            });
        }catch (error) {
            console.error(error);
            allTestsPassed = false;
        }
    
    });
});
after(() => {
    if (allTestsPassed) {
        process.exit(0); // All tests passed, exit with code 0
    } else {
        process.exit(1); // At least one test failed, exit with code 1
    }
});

});
