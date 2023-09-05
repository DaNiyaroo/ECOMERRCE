const express = require("express");
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const productRoute = express.Router()

productRoute.post('/',authMiddlewareOne, roleMiddleware('admin', 'moderator'),(req, res) => res.send('Product route, POST method'))
productRoute.get("/", (req, res)=> res.send("Home adress. GET method"))
productRoute.put("/", (req, res)=> res.send("Home adress. PUT method"))
productRoute.delete("/", (req, res)=> res.send("Home adress. DELETE method"))

module.exports = productRoute

