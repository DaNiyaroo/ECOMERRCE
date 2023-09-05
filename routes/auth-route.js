const express = require('express')
const authRoute = express.Router()
const jwt = require('jsonwebtoken')
const pool = require('../db/db.config.js')
const bcrypt = require('bcryptjs')

authRoute.post('/sign-in', (req, res) => {
    try {
        const { username, password } = req.body
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
        const accessToken = jwt.sign({ username, role: "admin" }, accessTokenSecret, { expiresIn: '1d' })
        const refreshToken = jwt.sign({ username, role: "admin" }, refreshTokenSecret, { expiresIn: '10d' })
        res.send({ success: true, error: null, data: { accessToken, refreshToken } })
    } catch (error) {
        res.send({ success: false, error: error, message: error.message })
    }
})


authRoute.post('/register', async (req, res, next) => {
    try {
        const { name, password, phone} = req.body;
        const checkUserQuery = 'SELECT * FROM user WHERE phone = ?';

        const [rows, columns] = await pool.query(checkUserQuery, phone);
       

        if (rows.length > 0) {
            const error = new Error('User with this phone number already exists');
            error.statusCode = 409
            throw error
            return;
        }

        const salt = bcrypt.genSaltSync(10);
        const userHashedPassword = bcrypt.hashSync(password, salt);

        const newUser = {
            name: name,
            hashedPassword: userHashedPassword,
            phone,
        };

        const insertUserQuery = 'INSERT INTO user SET ?';

        await pool.query(insertUserQuery, newUser);

        res.status(200).json({ message: 'Registration was successful' });
    } catch (error) {
        next(error)
    }
});

authRoute.post('/login', async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    const getUserQuery = 'SELECT * FROM user WHERE phone = ?';

    const [rows] = await pool.query(getUserQuery, phone);

    if (rows.length === 0) {
      const error = new Error('User does not exist');
      error.statusCode = 400;
      throw error;
    }

    const isMatch = bcrypt.compareSync(password, rows[0].hashedPassword);

    if (isMatch) {
      const accessToken = jwt.sign({ userId: rows[0].ID, role: rows[0].role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });

      const refreshToken = jwt.sign({ userId: rows[0].ID, role: rows[0].role }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '10d' });

      const hashedRefreshToken = bcrypt.hashSync(refreshToken, 10);

      const updateRefreshTokenQuery = 'UPDATE user SET hashedRefreshToken = ? WHERE id = ?';
      await pool.query(updateRefreshTokenQuery, [hashedRefreshToken, rows[0].ID]);

      res.status(200).json({ accessToken, refreshToken });
    } else {
      const error = new Error('Wrong password');
      error.statusCode = 401;
      throw error;
    }
  } catch (error) {
    next(error);
  }
});

authRoute.post('/logout', async (req, res, next) => {
  try {
    const { refreshToken, userId } = req.body;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    if (decoded.userId !== userId) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error; 
    }

    const deleteRefreshTokenQuery = 'UPDATE user SET hashedRefreshToken = NULL WHERE hashedRefreshToken = ?';
    await pool.query(deleteRefreshTokenQuery, [refreshToken]);

    res.status(200).send('Logout successful');
  } catch (error) {
    next(error); 
  }
});

  authRoute.post('/refresh', (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            const error = new Error('refresh token not found');
            error.statusCode = 404
            throw error
        }
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        const decoded = jwt.verify(refreshToken, refreshTokenSecret);

        const userId = decoded.ID; 

        const newAccessToken = jwt.sign(
            { ID: userId, role: decoded.role },
            accessTokenSecret,
            { expiresIn: '1d' }
        );
        const newRefreshToken = jwt.sign(
            { ID: userId, role: decoded.role },
            refreshTokenSecret,
            { expiresIn: '10d' }
        );

        res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        next(error)
    }
});



module.exports = authRoute
