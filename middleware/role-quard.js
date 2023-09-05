function roleMiddleware(...args) {
  return (req, res, next) => {
    try {
      if (!args.includes(req.role)) {
        return res.status(401).send("Invalid Operation!");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
}

module.exports = roleMiddleware;