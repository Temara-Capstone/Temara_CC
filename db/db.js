const mysql = require('mysql')
// const bcrypt = require('bcrypt')

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

conn.connect(function(error){
    if(error) throw error
    console.log('Connected to temara')
})

module.exports = conn