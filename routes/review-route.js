const express = require('express')
const reviewRoute = express.Router()
const authMiddlewareOne = require('../middleware/auth-quard')
const roleMiddleware = require('../middleware/role-quard')
const { findAllReview, postReview, getByIdReview, putReview, removeReview } = require('../controller/review-controller')

reviewRoute.get('/', authMiddlewareOne, roleMiddleware("admin"), findAllReview)
reviewRoute.post('/', authMiddlewareOne, roleMiddleware("admin"), postReview)
reviewRoute.get('/:id', authMiddlewareOne, roleMiddleware("admin"), getByIdReview)
reviewRoute.put('/:id', authMiddlewareOne, roleMiddleware("admin"), putReview)
reviewRoute.delete('/:id', authMiddlewareOne, roleMiddleware("admin"), removeReview)

module.exports = reviewRoute