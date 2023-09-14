const express = require("express");
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const productRoute = express.Router()
const {postProduct, findAllProduct, getByIdProduct, putProduct, removeProduct} = require("../controller/product-controller")

productRoute.get('/', findAllProduct)
productRoute.post('/', authMiddlewareOne, roleMiddleware('admin', 'moderator'), postProduct)
productRoute.get("/:id", getByIdProduct)
productRoute.put('/:id', authMiddlewareOne, roleMiddleware('admin', 'moderator'), putProduct)
productRoute.delete('/:id', authMiddlewareOne, roleMiddleware('admin', 'moderator'), removeProduct)

module.exports = productRoute

