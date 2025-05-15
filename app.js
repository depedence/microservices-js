const express = require('express')
const authService = require('./authService')
const orderService = require('./orderService')
const loggerService = require('./loggerService')

const app = express()
app.use(express.json())

// Мидлвар авторизации
app.use(authService.authenticate)

// Маршруты заказов
app.post('/orders', orderService.createOrder)
app.get('/orders', orderService.getOrders)

module.exports = app
