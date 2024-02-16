const assert = require('assert');
const request = require('supertest');
//const app = require('../../server');
const { sequelize } = require('../database/database');
const userModel = require('../models/User');
const {createDatabase} = require('../database/database');
const initializeServer = require('../../server');
 
 
    describe('/v1/user endpoint', () => {
        let allTestsPassed = true;
        let app;
        let chai;
        let expect;
 
        before(async () => {
            chai = await import('chai');
            app= await initializeServer();
            expect = chai.expect;
        });
 
        describe('POST /v1/user', () => {
            try{
                it('POST & GET', async () => {
                    const userData = {
                        first_name: 'a',
                        last_name: 'b',
                        username: 'dev3@gmail.com',
                        password: 'password1'
                    };
                    console.log("post method")
                    var response;
                    response = await request(app)
                        .post('/v1/user')
                            .send(userData)
                                .expect(201);
                    
                    console.log("asnwer",response.body);
                    expect(response.body).to.have.property('id');
                    expect(response.body.first_name).to.equal(userData.first_name);
                        
                  
                    const authHeader = Buffer.from('dev3@gmail.com:password1').toString('base64');
                    console.log("get", authHeader);
                    
                    response = await request(app)
                        .get('/v1/user/self')
                        .set('Authorization', `Basic ${authHeader}`)
                        .expect(200);
        
                    console.log("answer2",response.body);
                    assert(response.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                    assert(response.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
                    assert.strictEqual(response.body.userResponse.first_name, 'a', 'First name should match');
                    assert.strictEqual(response.body.userResponse.last_name, 'b', 'Last name should match');
                    assert.strictEqual(response.body.userResponse.username, 'dev3@gmail.com', 'Username should match');
                
                });
            }catch (error) {
                console.error(error);
                allTestsPassed = false;
            }
        
            
        });
        
        
        
        
        describe('PUT /v1/user/self', () => {
            
            it('PUT & GET', async () => {
                try{
                    const authHeader = Buffer.from('dev3@gmail.com:password1').toString('base64');
                        const userDataput = {
                            first_name: 'aa',
                            last_name: 'bb',
                            password: 'password12'
                        };
            
                        var response;
                        response = await request(app)
                        .put('/v1/user/self')
                        .set('Authorization', `Basic ${authHeader}`)
                        .send(userDataput)
                        .expect(204);
                        
                        // console.log("Second",response.body);
                        // expect(response.body).to.have.property('id');
                        // expect(response.body.first_name).to.equal(userDataput.first_name);
                        
                        
                        // console.log(response.body.userResponse);
                        // assert(response.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                        // assert(response.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
                        // assert.strictEqual(response.body.userResponse.first_name, 'aa', 'First name should match');
                        // assert.strictEqual(response.body.userResponse.last_name, 'bb', 'Last name should match');
                       
            
                        const authHeaderGet = Buffer.from('dev3@gmail.com:password12').toString('base64');
                        
                        response = await request(app)
                            .get('/v1/user/self')
                            .set('Authorization', `Basic ${authHeaderGet}`)
                            .expect(200);
        
                        console.log("srikar123",response.body);
                        assert(response.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                        assert(response.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
                        assert.strictEqual(response.body.userResponse.first_name, 'aa', 'First name should match');
                        assert.strictEqual(response.body.userResponse.last_name, 'bb', 'Last name should match');
                        assert.strictEqual(response.body.userResponse.username, 'dev3@gmail.com', 'Username should match');
                              
                }catch (error) {
                    console.error(error);
                    allTestsPassed = false;
                }
            
            });
        });
        
        
        
        
        // after(() => {
        //     if (allTestsPassed) {
        //         process.exit(0); // All tests passed, exit with code 0
        //     } else {
        //         process.exit(1); // At least one test failed, exit with code 1
        //     }
        // });
        
    })