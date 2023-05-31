const conn = require('../db/db')

// const CreateUserTable = ()=>{
//     const query = `
//         CREATE TABLE IF NOT EXISTS Users (
//             id INTEGER PRIMARY KEY AUTO_INCREMENT,
//             name VARCHAR(100) NOT NULL,
//             email VARCHAR(100) NOT NULL,
//             password VARCHAR(100) NOT NULL
//         )
//     `
//     conn.query(query, (err, result)=>{
//         if(err) throw err
//         console.log('Table Users created')
//     })
// }

const Users = {
    // GET ALL USERS
    getAllUsers: (req, res) => {
        const query = 'SELECT * FROM users'
        conn.query(query, (err, result) => {
            if (err){
                return res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                })
            }
            res.json(result)
            console.log(result)
            })
    },
    // UPDATE USER TOKEN
    updateUserToken: (req, callback) => {
        const id = req.id
        const token = req.token
        const query = 'UPDATE users SET refresh_bearer_token = ? WHERE id = ?'
        conn.query(query, [token, id], (err, result)=>{
            if (err){
                callback(err, null)
            }
            callback(null, result)
        })
    },

    getUserByWhere: (column, condition, callback) => {
        const query = `SELECT * FROM users WHERE ${column} = ?`
        conn.query(query, [condition], (err, results)=>{
            if (err){
                callback(err, null)
                return
            }
            callback(null, results)
        })
    },

    registerUser: async (data, hash, callback)=>{
        try{
            console.log(data.body)
            const { name, email, no_hp, gender, dateofbirth } = data.body
            conn.query(`INSERT INTO users (name, email, password, no_hp, gender, dateofbirth)
                VALUES ('${name}', '${email}', '${hash}', '${no_hp}', '${gender}', STR_TO_DATE('${dateofbirth}', '%Y/%m/%d'))`, (err, result) => {
                if(err){
                    callback(err, null)
                }else{
                    callback(null, result)
                }
            })
        }catch (e) {
            console.error(e)
            callback(e, null)
        }
    }
}

module.exports = Users