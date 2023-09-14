const express = require('express')
const orderRoute = express.Router()
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const { getByIdOrder, findAllOrder, postOrder, putOrder, removeOrder } = require("../controller/order-controller")

orderRoute.get('/', authMiddlewareOne, roleMiddleware("admin"), findAllOrder)
orderRoute.post('/', authMiddlewareOne, roleMiddleware("admin"), postOrder)
orderRoute.get('/:id', authMiddlewareOne, roleMiddleware("admin"), getByIdOrder)
orderRoute.put('/:id', authMiddlewareOne, roleMiddleware("admin"), putOrder)
orderRoute.delete('/:id', authMiddlewareOne, roleMiddleware("admin"), removeOrder)

module.exports = orderRoute