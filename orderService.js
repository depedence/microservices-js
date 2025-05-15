// Заказы хранятся в памяти и принадлежат пользователю

const logger = require('./loggerService')
const orders = []

exports.createOrder = (req, res) => {
  const { item, quantity } = req.body

  if (!item || !quantity) {
    return res.status(400).json({ error: 'Invalid order data' })
  }

  const order = {
    id: orders.length + 1,
    userId: req.user.id,
    item,
    quantity
  }

  orders.push(order)
  logger.log({ userId: req.user.id, action: 'CREATE_ORDER', order })

  res.status(201).json({ success: true, order })
}

exports.getOrders = (req, res) => {
  const userOrders = orders.filter(o => o.userId === req.user.id)

  logger.log({ userId: req.user.id, action: 'GET_ORDERS' })
  res.json({ orders: userOrders })
}
