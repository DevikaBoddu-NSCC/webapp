const assert = require('assert');
const request = require('supertest');
const app = require('../../server'); 
const { sequelize } = require('../database/database');
const userModel = require('../models/User');

describe('/v1/user endpoint', () => {
    let allTestsPassed = true;

    describe('POST /v1/user', () => {
        it('POST & GET', async () => {
            const userData = {
                first_name: 'a',
                last_name: 'b',
                username: 'dev3@gmail.com',
                password: 'password1'
            };
            
            console.log("post method");
            
            const response = await request(app)
                .post('/v1/user')
                .send(userData)
                .expect(201)
                .then(async () => {
                    // Code to execute after successful POST request
                    console.log('POST request successful');
                    // Additional actions here
                    const authHeader = Buffer.from('dev3@gmail.com:password1').toString('base64');
                    console.log("get", authHeader);
                    const response1 = await request(app)
                        .get('/v1/user/self')
                        .set('Authorization', `Basic ${authHeader}`)
                        .expect(200); 

                    assert(response1.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                    assert(response1.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
                    assert.strictEqual(response1.body.userResponse.first_name, 'a', 'First name should match');
                    assert.strictEqual(response1.body.userResponse.last_name, 'b', 'Last name should match');
                    assert.strictEqual(response1.body.userResponse.username, 'dev3@gmail.com', 'Username should match');
                });

        });
    });

    describe('PUT /v1/user/self', () => {
        it('should update user information', async () => {
            const authHeader = Buffer.from('dev3@gmail.com:password1').toString('base64');
            const userDataput = {
                first_name: 'aa',
                last_name: 'bb',
                password: 'password12'
            };

            const response = await request(app)
                .put('/v1/user/self')
                .set('Authorization', `Basic ${authHeader}`)
                .send(userDataput)
                .expect(204)
                .then(async () => {
                    // Code to execute after successful PUT request
                    console.log('PUT request successful');
                    // Additional actions here
                    const authHeaderGet = Buffer.from('dev3@gmail.com:password12').toString('base64');
                    const response1 = await request(app)
                        .get('/v1/user/self')
                        .set('Authorization', `Basic ${authHeaderGet}`)
                        .expect(200); 

                    assert(response1.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                    assert(response1.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
                    assert.strictEqual(response1.body.userResponse.first_name, 'aa', 'First name should match');
                    assert.strictEqual(response1.body.userResponse.last_name, 'bb', 'Last name should match');
                    assert.strictEqual(response1.body.userResponse.username, 'dev3@gmail.com', 'Username should match');
                });

        });
    });

});
