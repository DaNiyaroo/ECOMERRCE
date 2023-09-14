const pool = require('../db/db.config.js');
const Pagination = require('../utils/pagination.js');


async function postBasket(req, res, next) {
  try {
    const { productID, userID, count } = req.body;
    const params = {  productID, userID, count }
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
    const query = "INSERT INTO basket SET ?"
    await pool.query(query,params)
    res.send('Successfully created')
  } catch (error) {
    next(error); 
  }
}

async function findAllBasket(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const paginationLimit = parseInt(req.query.limit) || 10; 

    const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM basket';
    const [totalResult] = await pool.query(getTotalItemsQuery);
    const totalItems = totalResult[0].total;

    const pagination = new Pagination(currentPage, paginationLimit, totalItems);

    const limit = pagination.limit;
    const offset = pagination.offset;

    const getItemsQuery = 'SELECT * FROM basket LIMIT ? OFFSET ?';
    const [result] = await pool.query(getItemsQuery, [limit, offset]);

    if (result.length === 0) {
      const error = new Error('Basket not found');
      error.statusCode = 404
      throw error
    }
    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getByIdBasket(req, res, next) {
  try {
    const basketId= req.params.id;
    console.log(basketId);

    const [[basket]] = await pool.query("SELECT * FROM basket WHERE ID = ?", [basketId]);
    if (!basket) {
      const error = new Error(`Category with ID ${basketId} not found`);
      error.statusCode = 404;
      throw error
    }
    res.send(basket);
  } catch (error) {
    next(error)
  }
}

async function putBasket(req, res, next) {
  try {
    const { productID, userID, count } = req.body;
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

    const getBasketQuery = 'SELECT * FROM basket WHERE ID = ?';
    const [basket, columns] = await pool.query(getBasketQuery, [id]);

    if (basket.length === 0) {
      const error = new Error("Basket not found")
      error.statusCode = 404
      throw error
      return;
    }

    const updatedBasket = {
        productID: productID !== undefined ? productID : basket[0].productID,
        userID: userID !== undefined ? userID : basket[0].userID,
        count: count !== undefined ? count : basket[0].count
    };
    
    const updateBasketQuery = 'UPDATE basket SET productID = ?, userID = ?, count = ? WHERE ID = ?';
    const updateParams = [
        updatedBasket.productID !== undefined ? updatedBasket.productID : null,
        updatedBasket.userID !== undefined ? updatedBasket.userID : null,
        updatedBasket.count !== undefined ? updatedBasket.count : null
    ];
    await pool.query(updateBasketQuery, [...updateParams, id]);

    res.status(200).json({ success: true, message: 'Basket updated successfully' });
  } catch (error) {
    next(error); 
  }
}

async function removeBasket(req, res, next) {
  try {
    const ID = req.params.id;

    const getBasketQuery = 'SELECT * FROM basket WHERE ID = ?';
    const [basket, columns] = await pool.query(getBasketQuery, [ID]);

    if (basket.length === 0) {
      const error = new Error("basket not found")
      error.statusCode = 404
      throw error
      return;
    }

    const deleteBasketQuery = 'DELETE FROM basket WHERE ID = ?';
    await pool.query(deleteBasketQuery, [ID]);

    res.status(200).json({ success: true, message: 'Basket deleted successfully' });
  } catch (error) {
    next(error); 
  }
}

module.exports = { postBasket, getByIdBasket, findAllBasket, putBasket, removeBasket }
