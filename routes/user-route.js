const express = require('express');
const userRoute = express.Router();
const authMiddlewareOne = require("../middleware/auth-quard.js")
const roleMiddleware = require("../middleware/role-quard.js")
const {getUser, postUser, updateUser, removeUser} = require("../controller/user-controller.js");
const { use } = require('./auth-route.js');

userRoute.get("/",  getUser)
userRoute.post('/',    postUser)
userRoute.put("/:id",   updateUser)
userRoute.delete("/:id",  removeUser)

module.exports=userRoute
