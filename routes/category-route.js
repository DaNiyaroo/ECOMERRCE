const express = require('express');
const categoryRoute = express.Router();
const authMiddlewareOne = require('../middleware/auth-quard');
const roleMiddleware = require('../middleware/role-quard');
const pool = require("../db/db.config");
const { getById, put, remove, post, findAll} = require('../controller/category-controller');



// categoryRoute.get('/', async (req, res) => {
//     try {
//       const getAllCategoriesQuery = 'SELECT * FROM category';
//       const categories = await pool.query(getAllCategoriesQuery);
//       res.status(200).json({ success: true, data: categories });
//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server error');
//     }
//   });

// categoryRoute.get('/:id', getById)
  
// categoryRoute.post('/', authMiddlewareOne, roleMiddleware('admin', 'moderator'), async (req, res) => {
//     try {
//         const { nameUz, nameRu, desUz, desRu } = req.body;

//         const addCategoryQuery = 'INSERT INTO category (nameUz, nameru, desUz, desRu) VALUES (?, ?, ?, ?)';
//         await pool.query(addCategoryQuery, [nameUz, nameRu, desUz, desRu]);
//         res.status(200).json({ success: true, message: 'Category added successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });

// categoryRoute.put('/:id', authMiddlewareOne, roleMiddleware('admin', 'moderator'), async (req, res) => {
//     try {
//         const { nameUz, nameRu, desUz, desRu } = req.body;
//         const id = req.params.id

//         const getCategoryQuery = 'SELECT * FROM category WHERE ID = ?';
//         const [category, columns] = await pool.query(getCategoryQuery, [id]);

//         if (category.length === 0) {
//             res.status(404).json({ success: false, message: 'Category not found' });
//             return;
//         }

//         const updatedCategory = {
//             nameUz: nameUz || category[0].nameUz,
//             nameRu: nameRu || category[0].nameRu,
//             desUz: desUz || category[0].desUz,
//             desRu: desRu || category[0].desRu
//         };

//         const updateCategoryQuery = 'UPDATE category SET nameUz = ?, nameRu = ?, desUz = ?, desRu = ? WHERE ID = ?';
//         await pool.query(updateCategoryQuery, [updatedCategory.nameUz, updatedCategory.nameRu, updatedCategory.desUz, updatedCategory.desRu, id]);

//         res.status(200).json({ success: true, message: 'Category updated successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });

// categoryRoute.delete('/:id', authMiddlewareOne, roleMiddleware('admin'), async (req, res) => {
//     try {
//         const ID  = req.params.id;

//         const getCategoryQuery = 'SELECT * FROM category WHERE ID = ?';
//         const [category,columns] = await pool.query(getCategoryQuery, [ID]);

//         if (category.length === 0) {
//             res.status(404).json({ success: false, message: 'Category not found' });
//             return;
//         }

//         const deleteCategoryQuery = 'DELETE FROM category WHERE ID = ?';
//         await pool.query(deleteCategoryQuery, [ID]);

//         res.status(200).json({ success: true, message: 'Category deleted successfully' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('Server error');
//     }
// });
categoryRoute.get('/', findAll)
categoryRoute.post('/', authMiddlewareOne, roleMiddleware('admin', 'moderator'), post)
categoryRoute.get('/:id',  getById)
categoryRoute.delete('/:id', authMiddlewareOne, roleMiddleware('admin', 'moderator'), remove)
categoryRoute.put('/:id', authMiddlewareOne, roleMiddleware('admin', 'moderator'), put)

 module.exports = categoryRoute;
