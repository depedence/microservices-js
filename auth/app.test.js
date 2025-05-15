const request = require('supertest')
const app = require('./app')

describe('Тестирование авторизации', () => {
    let token

    beforeEach(async () => {
        const res = await request(app)
            .post('/login')
            .send({ password: 'qwerty' })

        token = res.body.token
    })

    test('POST /login возвращает токен при верном пароле', async () => {
        const res = await request(app)
            .post('/login')
            .send({ password: 'qwerty' })

        expect(res.statusCode).toBe(200)
        expect(res.body).toHaveProperty('token')
    })

    test('POST /login возвращает 403 при невалидном пароле', async () => {
        const res = await request(app)
            .post('/login')
            .send({ password: 'invalid' })

        expect(res.statusCode).toBe(403)
        expect(res.body).toHaveProperty('error', 'Invalid password')
    })

    test('POST /notes создает заметку при наличии токена', async () => {
        const res = await request(app)
            .post('/notes')
            .set(`Authorization`, `Bearer ${token}`)
            .send({ title: 'name', content: 'Alexander' })

        expect(res.statusCode).toBe(201)
        expect(res.body).toHaveProperty('id')
    })

    test('POST /notes возвращает ошибку 401 без токена', async () => {
        const res = await request(app)
            .post('/notes')
            .send({ title: 'name', content: 'Alexander' })

        expect(res.statusCode).toBe(401)
        expect(res.body).toHaveProperty('error', 'Unauthorized')
    })

    test('GET /notes возвращает список при наличии токена', async () => {
        await request(app)
            .post('/notes')
            .set(`Authorization`, `Bearer ${token}`)
            .send({ title: 'name', content: 'Alexander' })

        const res = await request(app)
            .get('/notes')
            .set(`Authorization`, `Bearer ${token}`)

        expect(res.statusCode).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
    })

    test('GET /notes/:id возвращает 401 без токена', async () => {
        const res = await request(app).get('/notes/1')

        expect(res.statusCode).toBe(401)
    })


})
