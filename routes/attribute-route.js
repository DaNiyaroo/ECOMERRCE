const express = require('express')
const attributeRoute = express.Router()
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const {getAttribute, postAttribute, updateAttribute, removeAttribute } = require("../controller/attribute-controller")

attributeRoute.get('/', authMiddlewareOne, roleMiddleware("admin"), getAttribute)
attributeRoute.post('/', authMiddlewareOne, roleMiddleware("admin"), postAttribute)
attributeRoute.put('/:id', authMiddlewareOne, roleMiddleware("admin"), updateAttribute)
attributeRoute.delete('/:id', authMiddlewareOne, roleMiddleware("admin"), removeAttribute)

module.exports = attributeRoute