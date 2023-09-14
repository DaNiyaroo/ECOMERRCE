const pool = require('../db/db.config.js');
const Pagination = require('../utils/pagination.js');


async function postProduct(req, res, next) {
  try {
    const { nameUz, nameRu, categoryID, descShortUz, descShortRu, descUz, descRu, isPopular, viewCount, price, cartCount, favoriteCount, orderCount, discount, images, attributeValueID } = req.body;
    const params = {  nameUz, nameRu, categoryID, descShortUz, descShortRu, descUz, descRu, isPopular, viewCount, price, cartCount, favoriteCount, orderCount, discount, images}
    if (categoryID) {
      const [[category]] = await pool.query("SELECT * FROM category WHERE ID = ?", categoryID)
      if (!category) {
        const error = new Error(`CategoryID with ID ${categoryID} not found`);
        error.statusCode = 404;
        throw error;
      }
    }
    const query = "INSERT INTO product SET ?"
    const [result] = await pool.query(query,params)
    const productID = result.insertId;

    if (categoryID) {
      const insertQuery = "INSERT INTO category_product (category_ID, product_ID) VALUES (?, ?)";
      await pool.query(insertQuery, [categoryID, productID]);
    }

    if (attributeValueID) {
      const insertQueryOne = "INSERT INTO product_attributevalue (product_ID, attributeValue_ID) VALUES (?, ?)";
      await pool.query(insertQueryOne, [productID, attributeValueID]);
    }
    res.send('Successfully created')
  } catch (error) {
    next(error); 
  }
}

async function findAllProduct(req, res, next) {
    try {
      const currentPage = parseInt(req.query.currentPage) || 1;
      const paginationLimit = parseInt(req.query.limit) || 10; 
  
      const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM product';
      const [totalResult] = await pool.query(getTotalItemsQuery);
      const totalItems = totalResult[0].total;
  
      const pagination = new Pagination(currentPage, paginationLimit, totalItems);
  
      const limit = pagination.limit;
      const offset = pagination.offset;
  
      const getItemsQuery = 'SELECT * FROM product LIMIT ? OFFSET ?';
      const [result] = await pool.query(getItemsQuery, [limit, offset]);
  
      if (result.length === 0) {
        const error =new Error('product not found');
        error.statusCode = 404
        throw error
      }
  
      res.send(result);
    } catch (error) {
      next(error)
    }
  }

  async function getByIdProduct(req, res, next) {
    try {
      const productId = req.params.id;
      
      const [[product]] = await pool.query('SELECT * FROM product WHERE id = ?', [productId]);
      const currentViewCount = product.vievCount;
      const newViewCount = currentViewCount + 1;

      await pool.query('UPDATE product SET vievCount = ? WHERE id = ?', [newViewCount, productId]);
      if (!product) {
        const error = new Error(`Product with ID ${productId} not found`);
        error.statusCode = 404;
        throw error
      }
      res.send(product);
    } catch (error) {
      next(error)
     
    }
  }

  async function putProduct(req, res, next) {
    try {
      const {nameUz, nameRu, categoryID, descShortUz, descShortRu, descUz, descRu, isPopular, viewCount, price, cartCount, favoriteCount, orderCount, discount, images} = req.body;
      const id = req.params.id;
  
      if (categoryID) {
        const [category] = await pool.query("SELECT * FROM category WHERE ID = ?", categoryID);
        if (!category) {
          const error = new Error("categoryId not found")
          error.statusCode = 404
          throw error
          
        }
      }
  
      const getProductQuery = 'SELECT * FROM product WHERE ID = ?';
      const [product, columns] = await pool.query(getProductQuery, [id]);
  
      if (product.length === 0) {
        const error = new Error("product not found")
        error.statusCode = 404
        throw error
      }
  
      const updatedProduct = {
        nameUz: nameUz !== undefined ? nameUz : product[0].nameUz,
        nameRu: nameRu !== undefined ? nameRu : product[0].nameRu,
        descShortUz: descShortUz !== undefined ? descShortUz : product[0].descShortUz,
        descShortRu: descShortRu !== undefined ? descShortRu : product[0].descShortRu,
        descUz: descUz !== undefined ? descUz : product[0].descUz,
        descRu: descRu !== undefined ? descRu : product[0].descRu,
        isPopular: isPopular !== undefined ? isPopular : product[0].isPopular,
        viewCount: viewCount !== undefined ? viewCount : product[0].viewCount,
        price: price !== undefined ? price : product[0].price,
        cartCount: cartCount !== undefined ? cartCount : product[0].cartCount,
        favoriteCount: favoriteCount !== undefined ? favoriteCount : product[0].favoriteCount,
        orderCount: orderCount !== undefined ? orderCount : product[0].orderCount,
        discount: discount !== undefined ? discount : product[0].discount,
        images: images !== undefined ? images : product[0].images,
        categoryID: categoryID !== undefined ? categoryID : product[0].categoryID
      };
      
      const updateProductQuery = 'UPDATE product SET nameUz = ?, nameRu = ?, descShortUz = ?, descShortRu = ?, descUz = ?, descRu = ?, isPopular = ?, viewCount = ?, price = ?, cartCount = ?, favoriteCount = ?, orderCount = ?, discount = ?, images = ?, categoryID = ? WHERE ID = ?';
      const updateParams = [
        updatedProduct.nameUz !== undefined ? updatedProduct.nameUz : null,
        updatedProduct.nameRu !== undefined ? updatedProduct.nameRu : null,
        updatedProduct.descShortUz !== undefined ? updatedProduct.descShortUz : null,
        updatedProduct.descShortRu !== undefined ? updatedProduct.descShortRu : null,
        updatedProduct.descUz !== undefined ? updatedProduct.descUz : null,
        updatedProduct.descRu !== undefined ? updatedProduct.descRu : null,
        updatedProduct.isPopular !== undefined ? updatedProduct.isPopular : null,
        updatedProduct.viewCount !== undefined ? updatedProduct.viewCount : null,
        updatedProduct.price !== undefined ? updatedProduct.price : null,
        updatedProduct.cartCount !== undefined ? updatedProduct.cartCount : null,
        updatedProduct.favoriteCount !== undefined ? updatedProduct.favoriteCount : null,
        updatedProduct.orderCount !== undefined ? updatedProduct.orderCount : null,
        updatedProduct.discount !== undefined ? updatedProduct.discount : null,
        updatedProduct.images !== undefined ? updatedProduct.images : null,
        updatedProduct.categoryID !== undefined ? updatedProduct.categoryID : null
      ];
      await pool.query(updateProductQuery, [...updateParams, id]);
  
      res.status(200).json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
      next(error); 
    }
  }

  async function removeProduct(req, res, next) {
    try {
      const ID = req.params.id;
  
      const getProductQuery = 'SELECT * FROM product WHERE ID = ?';
      const [product, columns] = await pool.query(getProductQuery, [ID]);
  
      if (product.length === 0) {
        const error = new Error("product not found")
        error.statusCode = 404
        throw error
        return;
      }
  
      const deleteProductQuery = 'DELETE FROM product WHERE ID = ?';
      await pool.query(deleteProductQuery, [ID]);
  
      res.status(200).json({ success: true, message: 'product deleted successfully' });
    } catch (error) {
      next(error); 
    }
  }

  module.exports = {postProduct, findAllProduct, getByIdProduct, putProduct, removeProduct}