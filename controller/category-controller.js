const pool = require('../db/db.config.js');
const Pagination = require('../utils/pagination.js');


async function post(req, res, next) {
  try {
    const { nameUz, nameRu, desUz, desRu, image, parentCategoryID } = req.body;
    const params = { nameUz, nameRu, desUz, desRu, image, parentCategoryID }
    if (parentCategoryID) {
      const [[category]] = await pool.query("SELECT * FROM category WHERE ID = ?", parentCategoryID)
      if (!category) {
        const error = new Error(`Category with ID ${parentCategoryID} not found`);
        error.statusCode = 404;
        throw error;
      }
    }
    const query = "INSERT INTO category SET ?"
    await pool.query(query,params)
    res.send('Successfully created')
  } catch (error) {
    next(error); 
  }
}

async function findAll(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; 
    const paginationLimitFromQuery = parseInt(req.query.paginationLimit) || 15; 

    const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM category';
    const [totalResult] = await pool.query(getTotalItemsQuery);
    const totalItems = totalResult[0].total;

    const pagination = new Pagination(currentPage, paginationLimitFromQuery, totalItems);
    const limit = pagination.limit;
    const offset = pagination.offset;

    const getItemsQuery = 'SELECT * FROM category LIMIT ? OFFSET ?';
    const [result] = await pool.query(getItemsQuery, [limit, offset]);

    if (result.length === 0) {
      throw new Error('Category not found');
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function getById(req, res, next) {
  try {
    const categoryId = req.params.id;
    console.log(categoryId);

    const [[category]] = await pool.query("SELECT * FROM category WHERE ID = ?", [categoryId]);
    if (!category) {
      const error = new Error(`Category with ID ${categoryId} not found`);
      error.statusCode = 404;
      throw error
    }
    res.send(category);
  } catch (error) {
    next(error)
   
  }
}

async function put(req, res, next) {
  try {
    const { nameUz, nameRu, desUz, desRu, image, parentCategoryID } = req.body;
    const id = req.params.id;

    if (parentCategoryID) {
      const [category] = await pool.query("SELECT * FROM category WHERE ID = ?", parentCategoryID);
      if (!category) {
        const error = new Error("parentCategory not found")
        error.statusCode = 404
        throw error
        
      }
    }

    const getCategoryQuery = 'SELECT * FROM category WHERE ID = ?';
    const [category, columns] = await pool.query(getCategoryQuery, [id]);

    if (category.length === 0) {
      const error = new Error("Category not found")
      error.statusCode = 404
      throw error
      return;
    }

    const updatedCategory = {
      nameUz: nameUz !== undefined ? nameUz : category[0].nameUz,
      nameRu: nameRu !== undefined ? nameRu : category[0].nameRu,
      desUz: desUz !== undefined ? desUz : category[0].desUz,
      desRu: desRu !== undefined ? desRu : category[0].desRu,
      image: image !== undefined ? image : category[0].image,
      parentCategoryID: parentCategoryID !== undefined ? parentCategoryID : category[0].parentCategoryID
    };
    
    const updateCategoryQuery = 'UPDATE category SET nameUz = ?, nameRu = ?, desUz = ?, desRu = ?, image = ?, parentCategoryID = ? WHERE ID = ?';
    const updateParams = [
      updatedCategory.nameUz !== undefined ? updatedCategory.nameUz : null,
      updatedCategory.nameRu !== undefined ? updatedCategory.nameRu : null,
      updatedCategory.desUz !== undefined ? updatedCategory.desUz : null,
      updatedCategory.desRu !== undefined ? updatedCategory.desRu : null,
      updatedCategory.image !== undefined ? updatedCategory.image : null,
      updatedCategory.parentCategoryID !== undefined ? updatedCategory.parentCategoryID : null,
    ];
    await pool.query(updateCategoryQuery, [...updateParams, id]);

    res.status(200).json({ success: true, message: 'Category updated successfully' });
  } catch (error) {
    next(error); 
  }
}



async function remove(req, res, next) {
  try {
    const ID = req.params.id;

    const getCategoryQuery = 'SELECT * FROM category WHERE ID = ?';
    const [category, columns] = await pool.query(getCategoryQuery, [ID]);

    if (category.length === 0) {
      const error = new Error("Category not found")
      error.statusCode = 404
      throw error
      return;
    }

    const deleteCategoryQuery = 'DELETE FROM category WHERE ID = ?';
    await pool.query(deleteCategoryQuery, [ID]);

    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error); 
  }
}

module.exports = { post, findAll, getById, put, remove }
