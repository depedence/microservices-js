const request = require('supertest')
const app = require('./app')

describe('Сервис заметок', () => {

    test('POST /notes добавляет новую заметку', async () => {
        // Создаем данные для новой заметки
        const newNote = { title: 'name', content: 'Alexander' }

        // Отправляем запрос на создание заметки
        const response = await request(app)
            .post('/notes')
            .send(newNote) // Отправляем данные заметки в теле запроса

        // Проверяем, что статус код 201
        expect(response.status).toBe(201)

        // Проверяем правильность заметки
        expect(response.body).toMatchObject(newNote)

        // Проверяем, что id заметки увеличился автоматически
        expect(response.body).toHaveProperty('id')
    })

    test('POST /notes возвращает ошибку, если отсутствует title || content', async () => {
        // создаем данные с ошибкой
        const newNote = { title: 'name' }

        // отправляем запрос с некорректными данными
        const response = await request(app)
            .post('/notes')
            .send(newNote)

        // проверяем, что статус код 400
        expect(response.status).toBe(400)

        // проверяем, что в теле ответа сообщ об ошибке
        expect(response.body).toEqual({ "error": "Missing title or content" })

    })

    test('GET /notes возвращает список всех заметок', async () => {
        // создаем две заметки
        const note1 = { title: 'name', content: 'Alexander' }
        const note2 = { title: 'age', content: '21' }

        // отправляем POST запрос с этими заметками
        await request(app).post('/notes').send(note1)
        await request(app).post('/notes').send(note2)

        // отправляем GET запрос на получение всех заметок
        const response = await request(app).get('/notes')

        // проверяем статус код 200
        expect(response.status).toBe(200)

        // проверяем, что в ответе массив и что в нем две заметки
        expect(Array.isArray(response.body)).toBe(true)
        expect(response.body.length).toBe(3)
        expect(response.body[0]).toHaveProperty('title', 'name')

    })

})
