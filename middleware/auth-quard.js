const jwt = require("jsonwebtoken");

const authMiddlewareOne = (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (token) {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

      const { username, role } = jwt.verify(token, accessTokenSecret);
      req.username = username;
      req.role = role;
      next();
    } else {
      throw new Error("No token provided");
    }
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddlewareOne;