const express = require('express')
const attributeValueRoute = express.Router()
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const { getAttributevalue, postAttributevalue, updateAttributevalue, removeAttributeValue, getByIdAttributeValue } = require("../controller/attribteValue-controller")

attributeValueRoute.get('/', authMiddlewareOne, roleMiddleware("admin"), getAttributevalue)
attributeValueRoute.post('/', authMiddlewareOne, roleMiddleware("admin"), postAttributevalue)
attributeValueRoute.get('/:id', authMiddlewareOne, roleMiddleware("admin"), getByIdAttributeValue)
attributeValueRoute.put('/:id', authMiddlewareOne, roleMiddleware("admin"), updateAttributevalue)
attributeValueRoute.delete('/:id', authMiddlewareOne, roleMiddleware("admin"), removeAttributeValue)

module.exports = attributeValueRoute