const pool = require('../db/db.config.js');
const Pagination = require('../utils/pagination.js');


async function postOrder(req, res, next) {
    try {
        const { productID, userID, addressID, deliveryTime, orderStatus, deliveryPrice } = req.body;
        const params = { productID, userID, addressID, deliveryTime, orderStatus, deliveryPrice }
        if (productID) {
            const [[product]] = await pool.query("SELECT * FROM product WHERE ID = ?", productID)
            if (!product) {
                const error = new Error(`product with ID ${productID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        if (userID) {
            const [[user]] = await pool.query("SELECT * FROM user WHERE ID = ?", userID)
            if (!user) {
                const error = new Error(`user with ID ${userID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        if (addressID) {
            const [[address]] = await pool.query("SELECT * FROM address WHERE ID = ?", addressID)
            if (!address) {
                const error = new Error(`address with ID ${addressID} not found`);
                error.statusCode = 404
                throw error
            }
        }
        const query = "INSERT INTO `order` SET ?"
        await pool.query(query, params)
        res.send('Successfully created')
    } catch (error) {
        next(error);
    }
}

async function findAllOrder(req, res, next) {
    try {
        const currentPage = parseInt(req.query.currentPage) || 1;
        const paginationLimit = parseInt(req.query.limit) || 10;

        const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM `order`';
        const [totalResult] = await pool.query(getTotalItemsQuery);
        const totalItems = totalResult[0].total;

        const pagination = new Pagination(currentPage, paginationLimit, totalItems);

        const limit = pagination.limit;
        const offset = pagination.offset;

        const getItemsQuery = 'SELECT * FROM `order` LIMIT ? OFFSET ?';
        const [result] = await pool.query(getItemsQuery, [limit, offset]);

        if (result.length === 0) {
            const error = new Error('order not found');
            error.statusCode = 404
            throw error
        }
        res.send(result);
    } catch (error) {
        next(error)
    }
}

async function getByIdOrder(req, res, next) {
    try {
        const orderID = req.params.id;
        console.log(orderID);

        const [[order]] = await pool.query("SELECT * FROM `order` WHERE ID = ?", [orderID]);
        if (!order) {
            const error = new Error(`order with ID ${orderID} not found`);
            error.statusCode = 404;
            throw error
        }
        res.send(order);
    } catch (error) {
        next(error)
    }
}

async function putOrder(req, res, next) {
    try {
        const { productID, userID, addressID, deliveryTime, orderStatus, deliveryPrice } = req.body
        const id = req.params.id;
        if (productID) {
            const [[product]] = await pool.query("SELECT * FROM product WHERE ID = ?", productID)
            if (!product) {
                const error = new Error(`product with ID ${productID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        if (userID) {
            const [[user]] = await pool.query("SELECT * FROM user WHERE ID = ?", userID)
            if (!user) {
                const error = new Error(`user with ID ${userID} not found`);
                error.statusCode = 404;
                throw error;
            }
        }
        if (addressID) {
            const [[address]] = await pool.query("SELECT * FROM address WHERE ID = ?", addressID)
            if (!address) {
                const error = new Error(`address with ID ${addressID} not found`);
                error.statusCode = 404
                throw error
            }
        }

        const getOrderQuery = 'SELECT * FROM `order` WHERE ID = ?';
        const [order, columns] = await pool.query(getOrderQuery, [id]);

        if (order.length === 0) {
            const error = new Error("order not found")
            error.statusCode = 404
            throw error
            return;
        }

        const updatedOrder = {
            productID: productID !== undefined ? productID : order[0].productID,
            userID: userID !== undefined ? userID : order[0].userID,
            addressID: addressID !== undefined ? addressID : order[0].addressID,
            deliveryTime: deliveryTime !== undefined ? deliveryTime : order[0].deliveryTime,
            orderStatus: orderStatus !== undefined ? orderStatus : order[0].orderStatus,
            deliveryPrice: deliveryPrice !== undefined ? deliveryPrice : order[0].deliveryPrice
        };

        const updateOrderQuery = 'UPDATE `order` SET productID = ?, userID = ?, addressID = ?, deliveryTime = ?, orderStatus = ?, deliveryPrice = ? WHERE ID = ?';
        const updateParams = [
            updatedOrder.productID !== undefined ? updatedOrder.productID : null,
            updatedOrder.userID !== undefined ? updatedOrder.userID : null,
            updatedOrder.addressID !== undefined ? updatedOrder.addressID : null,
            updatedOrder.deliveryTime !== undefined ? updatedOrder.deliveryTime : null,
            updatedOrder.orderStatus !== undefined ? updatedOrder.orderStatus : null,
            updatedOrder.deliveryPrice !== undefined ? updatedOrder.deliveryPrice : null,
        ];
        await pool.query(updateOrderQuery, [...updateParams, id]);

        res.status(200).json({ success: true, message: 'order updated successfully' });
    } catch (error) {
        next(error);
    }
}

async function removeOrder(req, res, next) {
    try {
        const ID = req.params.id;

        const getOrderQuery = 'SELECT * FROM `order` WHERE ID = ?';
        const [order, columns] = await pool.query(getOrderQuery, [ID]);

        if (order.length === 0) {
            const error = new Error("order not found")
            error.statusCode = 404
            throw error
            return;
        }

        const deleteOrderQuery = 'DELETE FROM `order` WHERE ID = ?';
        await pool.query(deleteOrderQuery, [ID]);

        res.status(200).json({ success: true, message: 'order deleted successfully' });
    } catch (error) {
        next(error);
    }
}

module.exports = { getByIdOrder, findAllOrder, postOrder, putOrder, removeOrder }
