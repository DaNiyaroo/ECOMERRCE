const pool = require('../db/db.config.js');

async function getAddress(req, res, next){
    try {
        const getAllAddress = 'SELECT * FROM address'
        const address= await pool.query(getAllAddress)
        res.status(200).json({success:true, data: address})  
    } catch (error) {
      next(error)
    }
}

async function postAddress(req, res, next) {
    try {
      const { region,	referencePoint,	street,	house,room } = req.body;
  
      const newAddress = {
        region:region,
        referencePoint:referencePoint,
        street:street,
        house:house,
        room:room
      };
  
      const insertAddressQuery = 'INSERT INTO address SET ?';
      await pool.query(insertAddressQuery, newAddress);
  
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