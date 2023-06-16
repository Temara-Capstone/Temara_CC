const mysql = require('mysql2')
// const bcrypt = require('bcrypt')

const conn = mysql.createConnection({
    // socketPath: '/cloudsql/temara-project:asia-southeast2:temara',
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
})

conn.connect(function(error){
    if(error){
        console.error(error)
    }
    console.log('Connected to temara')
})

module.exports = conn