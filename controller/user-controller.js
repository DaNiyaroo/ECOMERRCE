const pool = require('../db/db.config.js')
const bcrypt = require('bcryptjs')

async function getUser(req, res, next){
    try {
        const getAllUsers = 'SELECT * FROM user'
        const user = await pool.query(getAllUsers)
        res.status(200).json({success:true, data: user})  
    } catch (error) {
       next(error)
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