const request = require('supertest')
const app = require('../app')
const logger = require('../loggerService')

describe('🧪 Микросервис заказов с авторизацией', () => {
    beforeEach(() => {
        logger.clearLogs()
    })

    test('неавторизованный пользователь получает 401', async () => {
        const res = await request(app)
            .post('/orders')
            .send({ item: 'Tea', quantity: 2 })

        expect(res.statusCode).toBe(401)
        expect(res.body).toHaveProperty('error', 'Unauthorized')
    })

    test('авторизованный пользователь может создать заказ', async () => {
        const res = await request(app)
            .post('/orders')
            .set('Authorization', 'user-1-token')
            .send({ item: 'Tea', quantity: 2 })

        expect(res.statusCode).toBe(201)
        expect(res.body.order).toMatchObject( { item: 'Tea', quantity: 2 } )
    })

    test('созданный заказ сохраняется и возвращается только автору', async () => {
        // создаем заказ от имени user-1
        await request(app)
            .post('/orders')
            .set('Authorization', 'user-1-token')
            .send({ item: 'Tea', quantity: 2 })

        // Пытается получить user-2 — должен получить пустой список
        const res = await request(app)
            .get('/orders')
            .set('Authorization', 'user-2-token')

        expect(res.statusCode).toBe(200)
        expect(res.body.orders).toHaveLength(0)
    })

    test('в логах сохраняется информация о действиях', async () => {
        await request(app)
            .post('/orders')
            .set('Authorization', 'user-1-token')
            .send({ item: 'Tea', quantity: 2 })

        const logs = logger.getLogs()

        expect(logs).toHaveLength(1)
        expect(logs[0]).toMatchObject({
            userId: 1,
            action: 'CREATE_ORDER'
        })
    })
})
