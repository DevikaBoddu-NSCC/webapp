const assert = require('assert');
const request = require('supertest');
const app = require('../server');
const { createDatabase, sequelize, User } = require('../src/database/database');
// const {model} = require('../models/User');

describe('/v1/user endpoint', () => {
    let allTestsPassed = true;
    const userData = {
        first_name: 'a',
        last_name: 'b',
        username: 'dev1@gmail.com',
        password: 'password1'
    };
    before(async () => {
        await createDatabase();
        await sequelize.sync({ alter: true });
    });

    describe('POST /v1/user', () => {
        try{
            it('Test 1 - Create an account, and using the GET call, validate account exists.', async () => {
                const postResponse = await request(app)
                    .post('/v1/user')
                    .send(userData)
                    .expect(201);
                
                await User.update({ isVerified: true }, { where: { username: userData.username } });
                assert(postResponse.body.hasOwnProperty('id'), 'Response body should contain id property');
                assert.strictEqual(postResponse.body.first_name, userData.first_name, 'First name should match');
    
                console.log("postResponse.body :::", postResponse.body);
                // GET request after POST
                const authHeader = Buffer.from(`${userData.username}:${userData.password}`).toString('base64');

                return request(app)
                    .get('/v1/user/self')
                    .set('Authorization', `Basic ${authHeader}`)
                    .expect(200)
                    .then(response => {

                        assert(response.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                        assert(response.body.userResponse.hasOwnProperty('id'), 'userResponse should have id property');
                        assert.strictEqual(response.body.userResponse.first_name, 'a', 'First name should match');
                        assert.strictEqual(response.body.userResponse.last_name, 'b', 'Last name should match');
                        assert.strictEqual(response.body.userResponse.username, 'dev1@gmail.com', 'Username should match');
    
                        console.log("getResponse.body after POST:::", response.body);
                    });
            });  
        }catch (error) {
            console.error(error);
            allTestsPassed = false;
        }
        
        
        it('Test 2 - Update the account and using the GET call, validate the account was updated.', async () => {
            try {
                const authHeader = Buffer.from(`${userData.username}:${userData.password}`).toString('base64');
                const userDataput = {
                    first_name: 'aa',
                    last_name: 'bb',
                    password: 'password12'
                };
        
                const putResponse = await request(app)
                    .put('/v1/user/self')
                    .set('Authorization', `Basic ${authHeader}`)
                    .send(userDataput)
                    .expect(204);
                
                console.log("putResponse.body :::", putResponse.body);
                // GET request after PUT
                const authHeaderGet =  Buffer.from(`${userData.username}:${userDataput.password}`).toString('base64');

                return request(app)
                    .get('/v1/user/self')
                    .set('Authorization', `Basic ${authHeaderGet}`)
                    .expect(200)

                    .then(response => {

                        try{
                            console.log("GET after PUT ");
                            assert(response.body.hasOwnProperty('userResponse'), 'Response body should contain userResponse property');
                            assert.strictEqual(response.body.userResponse.first_name, 'aa', 'First name should match');
                            assert.strictEqual(response.body.userResponse.last_name, 'bb', 'Last name should match');
                            assert.strictEqual(response.body.userResponse.username, 'dev1@gmail.com', 'Username should match');
                            //assert.strictEqual(response.body.userResponse.username).to.equal('dev2@gmail.com');
                            console.log("getResponse.body after PUT:::", response.body);
                        } catch (error) {
                            console.error(error);
                            allTestsPassed = false;
                            // console.log( "allTestsPassed = false");
                        }

                    });



        
            } catch (error) {
                console.error(error);
                allTestsPassed = false;
                throw new Error('Request failed');
            }
        });
    });
    after(async () => {
        try {
          await User.destroy({
            where: { username: userData.username }
          });
          console.log('Test user deleted successfully.');
        } catch (error) {
          console.error('Failed to delete test user:', error);
        }
        // Close the Sequelize connection
        try {
          await sequelize.close();
          console.log('Sequelize connection closed successfully.');
        } catch (error) {
          console.error('Error closing Sequelize connection:', error);
        }
        if (allTestsPassed) {
            console.log("allTestsPassed:::",allTestsPassed);
            process.exit(0);  
        } else {
            console.log("allTestsPassedEXIT:::",allTestsPassed);
            process.exit(1);  
        }
      });
});









