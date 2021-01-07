const app = require('../src/app')

describe('App', () => {
    it('GET / responds with 200 containing "Hello, world!"', () => {
        console.log("entered app.js / route")
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!')
    })
})