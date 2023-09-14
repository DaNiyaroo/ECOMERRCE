const express = require('express')
const favoriteRoute = express.Router()
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const { getByIdFavorite, findAllFavorite, postFavorite, putFavorite, removeFavorite } = require("../controller/favorite-controller")

favoriteRoute.post('/', authMiddlewareOne, roleMiddleware("admin"), postFavorite)
favoriteRoute.get('/:id', authMiddlewareOne, roleMiddleware("admin"), getByIdFavorite)
favoriteRoute.get('/', authMiddlewareOne, roleMiddleware("admin"), findAllFavorite)
favoriteRoute.put('/:id', authMiddlewareOne, roleMiddleware("admin"), putFavorite)
favoriteRoute.delete('/:id', authMiddlewareOne, roleMiddleware("admin"), removeFavorite)

module.exports = favoriteRoute