const conn = require('../db/db')

const Quotes = {
    getRandomQuotes:(req, res)=>{
        const random = Math.floor(Math.random() * 50)
        const query = "SELECT * FROM quotes WHERE id = ?"
        conn.execute(query, [random], (err, results)=>{
            if(err){
                console.error(err)
                res.status(500).json({
                    status: 'error',
                    error: true, 
                    message: 'Internal Server Error'
                })
            }
            const result = results[0]
            res.status(200).json({
                status: 'success',
                error: false,
                message: 'Get Random Quotes Successfully',
                result: {
                    id: result.id,
                    quote: result.quote
                }
            })
        })
    }
}

module.exports = Quotes