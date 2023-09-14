const express = require('express')
const basketRoute = express.Router()
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const { postBasket, getByIdBasket, findAllBasket, putBasket, removeBasket } = require("../controller/basket-controller")

basketRoute.get('/', authMiddlewareOne, roleMiddleware("admin"), findAllBasket)
basketRoute.post('/', authMiddlewareOne, roleMiddleware("admin"), postBasket)
basketRoute.get('/:id', authMiddlewareOne, roleMiddleware("admin"), getByIdBasket)
basketRoute.put('/:id', authMiddlewareOne, roleMiddleware("admin"), putBasket)
basketRoute.delete('/:id', authMiddlewareOne, roleMiddleware("admin"), removeBasket)

module.exports = basketRoute