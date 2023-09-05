const mysql = require('mysql2')


const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    database: "ecommerce",
    password: "root",
    port: 3306,
}).promise()

module.exports=pool