const conn = require('../db/db')

const Quotes = {
    getRandomQuotes:(req, res)=>{
        const random = Math.floor(Math.random() * 50)
        const query = "SELECT * FROM quotes WHERE id = ?"
        conn.query(query, [random], (err, results)=>{
            if(err){
                console.error(err)
                res.status(500).json({
                    status: 'error',
                    message: 'Internal Server Error'
                })
            }
            res.status(200).json({
                status: 'success',
                message: 'Get Random Quotes Successfully',
                result: results
            })
        })
    }
}

module.exports = Quotes