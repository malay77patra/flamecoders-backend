const request = require('supertest');

const app = "http://localhost:8000";

describe('Public Routes Tests', () => {

    describe('GET /', () => {
        test('Should return 200 and "Server Online!"', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.text).toBe('Server Online!');
        });
    });

    describe('POST /register', () => {
        test('Should return 200 with success message', async () => {
            const res = await request(app)
                .post('/register')
                .send({
                    name: 'Test',
                    email: 'testmail@gmail.com',
                    password: '123456'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: {
                    message: 'User registered successfully.'
                }
            });
        });
    });

});
