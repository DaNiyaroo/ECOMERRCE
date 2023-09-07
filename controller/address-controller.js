const pool = require('../db/db.config.js');
const Pagination = require("../utils/pagination.js")

async function getAddress(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1;
    const paginationLimit = parseInt(req.query.limit) || 10; 

    const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM address';
    const [totalResult] = await pool.query(getTotalItemsQuery);
    const totalItems = totalResult[0].total;

    const pagination = new Pagination(currentPage, paginationLimit, totalItems);

    const limit = pagination.limit;
    const offset = pagination.offset;

    const getItemsQuery = 'SELECT * FROM address LIMIT ? OFFSET ?';
    const [result] = await pool.query(getItemsQuery, [limit, offset]);

    if (result.length === 0) {
      throw new Error('Address not found');
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function postAddress(req, res, next) {
    try {
      const { userID, region,	referencePoint,	street,	house,room } = req.body;
  
      if (userID) {
        const [[user]] = await pool.query("SELECT * FROM user WHERE user.ID = ?", userID)
        if (!user) {
          const error = new Error(`user with ID ${userID} not found`);
          error.statusCode = 404;
          throw error;
        }
      }

      const newAddress = {

        region:region,
        referencePoint:referencePoint,
        street:street,
        house:house,
        room:room
      };
  
      const insertAddressQuery = 'INSERT INTO address SET ?';
      await pool.query(insertAddressQuery, newAddress);
  
      const addAddressIdtoUserIdQuery = "SELECT user.ID FROM user LEFT JOIN address ON user.ID = address.userID"
      await pool.query(addAddressIdtoUserIdQuery)

      res.status(200).json({ success: true, message: 'Address added successfully' });
    } catch (error) {
      next(error)
    }
  }

  async function updateAddress(req, res, next){
    try {
        const  {region,	referencePoint,	street,	house,room} = req.body
        const id = req.params.id

        const getAddressQuery = 'SELECT * FROM address WHERE ID = ?';
        const [address, columns] = await pool.query(getAddressQuery, [id]);

        if (address.length === 0) {
          const error = new Error('Address not found')
          error.statusCode = 404
          throw error
          return;
          }
          const updateAddress = {
            region:region || address[0].region,
            referencePoint:referencePoint || address[0].referencePoint,
            street:street || address[0].street,
            house:house || address[0].house,
            room:room || address[0].house
          
          }
          const updateAddressQuery = 'UPDATE address SET ? WHERE ID = ?';
          await pool.query(updateAddressQuery, [updateAddress,id]);
          res.status(200).json({ success: true, message: 'Address updated successfully' });
    } catch (error) {
      next(error)  
    }
}

async function removeAddress(req, res, next){
    try {
        const ID = req.params.id;
    
        const getAddressQuery = 'SELECT * FROM address WHERE ID = ?';
        const [address, columns] = await pool.query(getAddressQuery, [ID]);
        if (address.length === 0) {
          const error = new Error("Address not found")
          error.statusCode = 404
          throw error
          return;
        }
        const deleteAddressQuery = 'DELETE FROM address WHERE ID = ?';
        await pool.query(deleteAddressQuery, [ID]);
        res.status(200).json({ success: true, message: 'Address deleted successfully' });
      } catch (error) {
        next(error)
      }
    };

    module.exports= { getAddress, postAddress, updateAddress, removeAddress}