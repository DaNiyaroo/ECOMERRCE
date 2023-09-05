const express = require('express')
const adressRoute = express.Router()
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const { getAddress, postAddress, updateAddress, removeAddress } = require("../controller/address-controller")

adressRoute.get('/', authMiddlewareOne, roleMiddleware("admin"), getAddress)
adressRoute.post('/', authMiddlewareOne, roleMiddleware("admin"), postAddress)
adressRoute.put('/:id', authMiddlewareOne, roleMiddleware("admin"), updateAddress)
adressRoute.delete('/:id', authMiddlewareOne, roleMiddleware("admin"), removeAddress)

module.exports = adressRoute