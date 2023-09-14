const pool = require('../db/db.config.js');
const Pagination = require("../utils/pagination.js");
const ApiResponse = require('../utils/response.js');

async function getAttribute(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const paginationLimit = parseInt(req.query.limit) || 10; 

    const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM attribute';
    const [totalResult] = await pool.query(getTotalItemsQuery);
    const totalItems = totalResult[0].total;

    const pagination = new Pagination(currentPage, paginationLimit, totalItems);

    const limit = pagination.limit;
    const offset = pagination.offset;

    const getItemsQuery = 'SELECT * FROM attribute LIMIT ? OFFSET ?';
    const [result] = await pool.query(getItemsQuery, [limit, offset]);

    if (result.length === 0) {
      throw new Error('Attribute not found');
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function postAttribute(req, res, next) {
    try {
      const { name, categoryID} = req.body;
      const params = { name }
      const insertAttributeQuery = 'INSERT INTO attribute SET ?';
      const [result] = await pool.query(insertAttributeQuery, params);
      const attributeID = result.insertId

      if (categoryID) {
        const insertAttributeQuery = "INSERT INTO category_attribute (category_id, attribute_id) VALUES (?, ?)";
        await pool.query(insertAttributeQuery, [categoryID, attributeID]);
      }
      // const response = new ApiResponse()
      res.status(200).json(new ApiResponse());
    } catch (error) {
      next(error)
    }
  }

  async function updateAttribute(req, res, next){
    try {
        const  {name} = req.body
        const id = req.params.id

        const getAttributeQuery = 'SELECT * FROM attribute WHERE ID = ?';
        const [attribute, columns] = await pool.query(getAttributeQuery, [id]);

        if (attribute.length === 0) {
          const error = new Error('attribute not found')
          error.statusCode = 404
          throw error
          return;
          }
          const updateAttribute = {
            name: name || attribute[0].name
          }
          const updateAttributeQuery = 'UPDATE attribute SET ? WHERE ID = ?';
          await pool.query(updateAttributeQuery, [updateAttribute, id]);
          res.status(200).json({ success: true, message: 'Attribute updated successfully' });
    } catch (error) {
      next(error)  
    }
}

async function removeAttribute(req, res, next){
    try {
        const ID = req.params.id;
    
        const getAttributeQuery = 'SELECT * FROM attribute WHERE ID = ?';
        const [attribute, columns] = await pool.query(getAttributeQuery, [ID]);
        if (attribute.length === 0) {
          const error = new Error("attribute not found")
          error.statusCode = 404
          throw error
          return;
        }
        const deleteAttributeQuery = 'DELETE FROM attribute WHERE ID = ?';
        await pool.query(deleteAttributeQuery, [ID]);
        res.status(200).json({ success: true, message: 'Attribute deleted successfully' });
      } catch (error) {
        next(error)
      }
    };

    module.exports= {getAttribute, postAttribute, updateAttribute, removeAttribute}