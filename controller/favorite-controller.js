const pool = require('../db/db.config.js');
const Pagination = require('../utils/pagination.js');


async function postFavorite(req, res, next) {
  try {
    const { productID, userID} = req.body;
    const params = {  productID, userID }
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
    const query = "INSERT INTO favorite SET ?"
    await pool.query(query,params)
    res.send('Successfully created')
  } catch (error) {
    next(error); 
  }
}

async function findAllFavorite(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const paginationLimit = parseInt(req.query.limit) || 10; 

    const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM favorite';
    const [totalResult] = await pool.query(getTotalItemsQuery);
    const totalItems = totalResult[0].total;

    const pagination = new Pagination(currentPage, paginationLimit, totalItems);

    const limit = pagination.limit;
    const offset = pagination.offset;

    const getItemsQuery = 'SELECT * FROM favorite LIMIT ? OFFSET ?';
    const [result] = await pool.query(getItemsQuery, [limit, offset]);

    if (result.length === 0) {
      const error = new Error('favorite not found');
      error.statusCode = 404
      throw error
    }
    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getByIdFavorite(req, res, next) {
  try {
    const favoritID= req.params.id;
    console.log(favoritID);

    const [[favorite]] = await pool.query("SELECT * FROM favorite WHERE ID = ?", [favoritID]);
    if (!favorite) {
      const error = new Error(`favorite with ID ${favoritID} not found`);
      error.statusCode = 404;
      throw error
    }
    res.send(favorite);
  } catch (error) {
    next(error)
  }
}

async function putFavorite(req, res, next) {
  try {
    const { productID, userID } = req.body
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

    const getFavoriteQuery = 'SELECT * FROM favorite WHERE ID = ?';
    const [favorite, columns] = await pool.query(getFavoriteQuery, [id]);

    if (favorite.length === 0) {
      const error = new Error("favorite not found")
      error.statusCode = 404
      throw error
      return;
    }

    const updatedFavorite = {
        productID: productID !== undefined ? productID : favorite[0].productID,
        userID: userID !== undefined ? userID : favorite[0].userID  
    };
    
    const updateFavoriteQuery = 'UPDATE favorite SET productID = ?, userID = ? WHERE ID = ?';
    const updateParams = [
        updatedFavorite.productID !== undefined ? updatedFavorite.productID : null,
        updatedFavorite.userID !== undefined ? updatedFavorite.userID : null,
    ];
    await pool.query(updateFavoriteQuery, [...updateParams, id]);

    res.status(200).json({ success: true, message: 'favorite updated successfully' });
  } catch (error) {
    next(error); 
  }
}

async function removeFavorite(req, res, next) {
  try {
    const ID = req.params.id;

    const getFavoriteQuery = 'SELECT * FROM favorite WHERE ID = ?';
    const [favorite, columns] = await pool.query(getFavoriteQuery, [ID]);

    if (favorite.length === 0) {
      const error = new Error("favorite not found")
      error.statusCode = 404
      throw error
      return;
    }

    const deleteFavoriteQuery = 'DELETE FROM favorite WHERE ID = ?';
    await pool.query(deleteFavoriteQuery, [ID]);

    res.status(200).json({ success: true, message: 'Favorite deleted successfully' });
  } catch (error) {
    next(error); 
  }
}

module.exports = { getByIdFavorite, findAllFavorite, postFavorite, putFavorite, removeFavorite }
