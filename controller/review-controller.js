const pool = require('../db/db.config.js');
const Pagination = require('../utils/pagination.js');


async function postReview(req, res, next) {
    try {
        const { comment, userID, stars, productID } = req.body;
        const params = { comment, userID, stars, productID }
        if (userID) {
            const [[user]] = await pool.query("SELECT * FROM user WHERE ID = ?", userID)
            if (!user) {
                const error = new Error(`user with ID ${userID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        if (productID) {
            const [[product]] = await pool.query("SELECT * FROM product WHERE ID = ?", productID)
            if (!product) {
                const error = new Error(`product with ID ${productID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        const query = "INSERT INTO review SET ?"
        await pool.query(query, params)
        res.send('Successfully created')
    } catch (error) {
        next(error);
    }
}

async function findAllReview(req, res, next) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const paginationLimit = parseInt(req.query.limit) || 10;

        const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM review';
        const [totalResult] = await pool.query(getTotalItemsQuery);
        const totalItems = totalResult[0].total;

        const pagination = new Pagination(currentPage, paginationLimit, totalItems);

        const limit = pagination.limit;
        const offset = pagination.offset;

        const getItemsQuery = 'SELECT * FROM review LIMIT ? OFFSET ?';
        const [result] = await pool.query(getItemsQuery, [limit, offset]);

        if (result.length === 0) {
            const error = new Error('review not found');
            error.statusCode = 404
            throw error
        }
        res.send(result);
    } catch (error) {
        next(error)
    }
}

async function getByIdReview(req, res, next) {
    try {
        const reviewID = req.params.id;
        console.log(reviewID);

        const [[review]] = await pool.query("SELECT * FROM review WHERE ID = ?", [orderID]);
        if (!review) {
            const error = new Error(`order with ID ${reviewID} not found`);
            error.statusCode = 404;
            throw error
        }
        res.send(review);
    } catch (error) {
        next(error)
    }
}

async function putReview(req, res, next) {
    try {
        const {  comment, userID, stars, productID } = req.body
        const id = req.params.id;
        if (userID) {
            const [[user]] = await pool.query("SELECT * FROM user WHERE ID = ?", userID)
            if (!user) {
                const error = new Error(`user with ID ${userID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        if (productID) {
            const [[product]] = await pool.query("SELECT * FROM product WHERE ID = ?", productID)
            if (!product) {
                const error = new Error(`product with ID ${productID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        const getReviewQuery = 'SELECT * FROM review WHERE ID = ?';
        const [review, columns] = await pool.query(getReviewQuery, [id]);

        if (review.length === 0) {
            const error = new Error("review not found")
            error.statusCode = 404
            throw error
            return;
        }

        const updatedReview = {
            comment: comment !== undefined ? comment : review[0].comment,
            userID: userID !== undefined ? userID : review[0].userID,
            stars: stars !== undefined ? stars : review[0].stars,
            productID: productID !== undefined ? productID : review[0].productID
        };

        const updateReviewQuery = 'UPDATE review SET comment = ?, userID = ?, stars = ?, productID = ? WHERE ID = ?';
        const updateParams = [
            updatedReview.comment !== undefined ? updatedReview.comment : null,
            updatedReview.userID !== undefined ? updatedReview.userID : null,
            updatedReview.stars !== undefined ? updatedReview.stars : null,
            updatedReview.productID !== undefined ? updatedReview.productID : null
        ];
        await pool.query(updateReviewQuery, [...updateParams, id]);

        res.status(200).json({ success: true, message: 'review updated successfully' });
    } catch (error) {
        next(error);
    }
}

async function removeReview(req, res, next) {
    try {
        const ID = req.params.id;

        const getReviewQuery = 'SELECT * FROM review WHERE ID = ?';
        const [review, columns] = await pool.query(getReviewQuery, [ID]);

        if (review.length === 0) {
            const error = new Error("review not found")
            error.statusCode = 404
            throw error
            return;
        }

        const deleteReviewQuery = 'DELETE FROM review WHERE ID = ?';
        await pool.query(deleteReviewQuery, [ID]);

        res.status(200).json({ success: true, message: 'review deleted successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = { getByIdReview, findAllReview, postReview, putReview, removeReview }
