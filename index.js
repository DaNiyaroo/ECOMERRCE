const express = require("express")
const authRoute = require('./routes/auth-route.js')
const app = express()
const productRoute = require("./routes/product-route.js");
const categoryRoute = require("./routes/category-route.js")
const userRoute = require("./routes/user-route.js")
const adressRoute = require('./routes/address-route.js')
const attributeRoute = require("./routes/attribute-route.js");
const attributeValueRoute = require("./routes/attributeValue-route.js");
const basketRoute = require("./routes/basket-route.js");
const favoriteRoute = require("./routes/favorite-route.js");
const orderRoute = require("./routes/order-route.js");
const reviewRoute = require("./routes/review-route.js");
const multer = require('multer')
require('dotenv').config()

const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/uploads');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random());
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  }
});
const upload = multer({ storage: storage });

app.post('/photos', upload.array('photos', 8), function (req, res) {
  const uploadedFiles = req.files;
  const filePaths = [];

  uploadedFiles.forEach(file => {
    const filePath = path.join(__dirname, 'uploads', file.filename);
    filePaths.push(filePath);
  });

  const combinedPaths = filePaths.join(';');
  res.json(combinedPaths);
});

const port = process.env.PORT || 4000
app.use(express.json())

app.use("/auth", authRoute)

app.use("/product", productRoute)

app.use('/category', categoryRoute)

app.use('/user', userRoute)

app.use('/address', adressRoute)

app.use("/attribute", attributeRoute)

app.use("/attributevalue", attributeValueRoute)

app.use("/basket", basketRoute)

app.use('/favorite', favoriteRoute)

app.use('/order', orderRoute)

app.use("/review", reviewRoute)

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




