const pool = require('../db/db.config.js')
const bcrypt = require('bcryptjs')
const Pagination = require("../utils/pagination.js")

async function getUser(req, res) {
  try {
    const currentPage = parseInt(req.query.currentPage) || 1; 
    const paginationLimit = parseInt(req.query.limit) || 10; 

    
    const getTotalItemsQuery = 'SELECT COUNT(*) AS total FROM user';
    const [totalResult] = await pool.query(getTotalItemsQuery);
    const totalItems = totalResult[0].total;

    const pagination = new Pagination(currentPage, paginationLimit, totalItems);

    const limit = pagination.limit;
    const offset = pagination.offset;

    const getItemsQuery = 'SELECT * FROM user LIMIT ? OFFSET ?';
    const [result] = await pool.query(getItemsQuery, [limit, offset]);

    if (result.length === 0) {
      throw new Error('user not found');
    }

    res.send(result);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function postUser(req, res, next) {
    try {
      const { name, phone, otp, image, password, hashedRefreshToken, role } = req.body;
  
      const salt = await bcrypt.genSalt(10);
      const userHashedPassword = await bcrypt.hash(password, salt);
  
      const newUser = {
        name: name,
        hashedPassword: userHashedPassword,
        phone: phone,
        otp: otp,
        image: image,
        hashedRefreshToken: hashedRefreshToken,
        role:role
      };
  
      const insertUserQuery = 'INSERT INTO user SET ?';
      await pool.query(insertUserQuery, newUser);
  
      res.status(200).json({ success: true, message: 'User added successfully' });
    } catch (error) {
      next(error)
    }
  }

async function updateUser(req, res, next){
    try {
        const  {name, phone, otp, image, hashedPassword, hashedRefreshToken, role} = req.body
        const id = req.params.id

        const getUserQuery = 'SELECT * FROM user WHERE ID = ?';
        const [user] = await pool.query(getUserQuery, [id]);

        if (user.length === 0) {
          const error = new Error("User not found")
          error.statusCode = 404
          throw error
             return;
          }
          const updateUser = {
            name: name || user[0].name,
            phone: phone || user[0].phone,
            otp: otp || user[0].otp,
            image: image || user[0].image,
            hashedPassword: hashedPassword || user[0].hashedPassword,
            hashedRefreshToken: hashedRefreshToken || user[0].hashedRefreshToken,
            role: role || user[0].role
          }
          const updateUserQuery = 'UPDATE user SET ? WHERE ID = ?';
          await pool.query(updateUserQuery, [updateUser,id]);
          res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        next(error)
    }
}

async function removeUser(req, res, next){
    try {
        const ID = req.params.id;
    
        const getUserQuery = 'SELECT * FROM user WHERE ID = ?';
        const [user, columns] = await pool.query(getUserQuery, [ID]);
        if (user.length === 0) {
          const error = new Error("Usaer not found")
          error.statusCode = 404
          throw error
          return;
        }
        const deleteUserQuery = 'DELETE FROM user WHERE ID = ?';
        await pool.query(deleteUserQuery, [ID]);
        res.status(200).json({ success: true, message: 'User deleted successfully' });
      } catch (error) {
        next(error)
      }
    };
    

module.exports = {getUser, postUser, updateUser, removeUser}