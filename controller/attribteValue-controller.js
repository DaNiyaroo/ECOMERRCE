const pool = require('../db/db.config.js');
const Pagination = require("../utils/pagination.js")

async function getByIdAttributeValue(req, res, next) {
  try {
    const attributeValueId = req.params.id;
    console.log(attributeValueId);

    const [[attributeValue]] = await pool.query("SELECT * FROM attributevalue WHERE ID = ?", [attributeValueId]);
    if (!attributeValue) {
      const error = new Error(`Attribute value with ID ${attributeValueId} not found`);
      error.statusCode = 404;
      throw error
    }
    res.send(attributeValue);
  } catch (error) {
    next(error)
   
  }
}

async function getAttributevalue(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const paginationLimit = parseInt(req.query.limit) || 10;

    const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM attributevalue';
    const [totalResult] = await pool.query(getTotalItemsQuery);
    const totalItems = totalResult[0].total;

    const pagination = new Pagination(currentPage, paginationLimit, totalItems);

    const limit = pagination.limit;
    const offset = pagination.offset;

    const getItemsQuery = 'SELECT * FROM attributevalue LIMIT ? OFFSET ?';
    const [result] = await pool.query(getItemsQuery, [limit, offset]);

    if (result.length === 0) {
      throw new Error('Attribute value not found');
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function postAttributevalue(req, res, next) {
  try {
    const { attributeID, name, productID } = req.body;

    if (attributeID) {
      const [[attribute]] = await pool.query("SELECT * FROM attribute WHERE ID = ?", attributeID)
      if (!attribute) {
        const error = new Error(`attribute with ID ${attributeID} not found`);
        error.statusCode = 404;
        throw error;
      }
    }

    const newAttribute = {
      attributeID,
      name
    };

    const insertAttributeQuery = 'INSERT INTO attributevalue SET ?';
    const [result] = await pool.query(insertAttributeQuery, newAttribute);
    const attributeValueID = result.insertId

    if (productID) {
      const insertQueryOne = "INSERT INTO product_attributevalue (product_ID, attributeValue_ID) VALUES (?, ?)";
      await pool.query(insertQueryOne, [productID, attributeValueID]);
    }
    res.status(200).json({ success: true, message: 'Attribute value added successfully' });
  } catch (error) {
    next(error)
  }
}

async function updateAttributevalue(req, res, next) {
  try {
    const { attributeID, name } = req.body
    const id = req.params.id
    if (attributeID) {
      const [[attribute]] = await pool.query("SELECT * FROM attributevalue WHERE user.ID = ?", attributeID)
      if (!attribute) {
        const error = new Error(`attribute with ID ${attributeID} not found`);
        error.statusCode = 404;
        throw error;
      }
    }

    const getAttributeQuery = 'SELECT * FROM attributevalue WHERE ID = ?';
    const [attributevalue, columns] = await pool.query(getAttributeQuery, [id]);

    if (attributevalue.length === 0) {
      const error = new Error('attribute value not found')
      error.statusCode = 404
      throw error
      return;
    }
    const updateAttribute = {
      attributeID: attributeID || attributevalue[0].attributeID,
      name: name || attributevalue[0].name
    }
    const updateAttributeQuery = 'UPDATE attributevalue SET ? WHERE ID = ?';
    await pool.query(updateAttributeQuery, [updateAttribute, id]);
    res.status(200).json({ success: true, message: 'Attribute value updated successfully' });
  } catch (error) {
    next(error)
  }
}

async function removeAttributeValue(req, res, next) {
  try {
    const ID = req.params.id;

    const getAttributeQuery = 'SELECT * FROM attributevalue WHERE ID = ?';
    const [attributevalue, columns] = await pool.query(getAttributeQuery, [ID]);
    if (attributevalue.length === 0) {
      const error = new Error("attribute value not found")
      error.statusCode = 404
      throw error
      return;
    }
    const deleteAttributeQuery = 'DELETE FROM attributevalue WHERE ID = ?';
    await pool.query(deleteAttributeQuery, [ID]);
    res.status(200).json({ success: true, message: 'Attribute value deleted successfully' });
  } catch (error) {
    next(error)
  }
};

module.exports = {  getByIdAttributeValue, getAttributevalue, postAttributevalue, updateAttributevalue, removeAttributeValue }