const request = require('supertest');
const app = require('../../server'); // Adjust the path as needed

describe('Health Check Endpoint', () => {
    it('should return 200 OK if the server is healthy', (done) => {
        request(app)
            .get('/healthz')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });

    // it('should return 503 Service Unavailable if the server is not healthy', (done) => {
    //     // Mock unhealthy state
    //     const originalPerformHealthCheck = require('../routes/healthz');
    //     const mockPerformHealthCheck = () => Promise.resolve(false);
    //     require.cache[require.resolve('../routes/healthz')].exports = mockPerformHealthCheck;

    //     request(app)
    //         .get('/healthz')
    //         .expect(503)
    //         .end((err, res) => {
    //             if (err) return done(err);
    //             require.cache[require.resolve('../routes/healthz')].exports = originalPerformHealthCheck;
    //             done();
    //         });
    // });

    
});

