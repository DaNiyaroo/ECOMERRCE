const express = require("express")
const authRoute = require('./routes/auth-route.js')
const app = express()
const authMiddlewareOne = require("./middleware/auth-quard.js");
const productRoute = require("./routes/product-route.js");
const categoryRoute = require("./routes/category-route.js")
const userRoute = require("./routes/user-route.js")
const adressRoute = require('./routes/address-route.js')
require('dotenv').config()


const port = process.env.PORT || 4000
app.use(express.json())

app.use("/auth", authRoute)

app.use("/product", productRoute)

app.use('/category', categoryRoute);

app.use('/user', userRoute)

app.use('/address', adressRoute)

app.get("/protected", authMiddlewareOne, (req, res) => {
  res.send(`Welcome, ${req.user.username}! You have access to the protected resource.`);
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: err.message,
      statusCode: statusCode,
    },
  });
});



app.listen(port, () => console.log(`Server listening on localhost:${port}`));



  
