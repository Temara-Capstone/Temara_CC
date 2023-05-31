const conn = require('../db/db')

const Articles = {
    getAllArticle: (req, res) => {
        const query = "SELECT * FROM article"
        conn.query(query, (err, results) => {
            if(err){
                console.error(err)
                res.status(500).json({
                    status: 'error',
                    message: 'Internal Server Error'
                })
            }
            res.status(200).json({
                status: 'success',
                message: 'Get All Article Successfully',
                result: results
            })

        })
    },

    getArticleById: (req, res, callback) => {
        const id = req.body.id
        const query = "SELECT * FROM article where id = ?";
        conn.query(query, [id], (err, results)=>{
            if(err){
                callback(err, null)
            }
            callback(null, results)
        })
    }
}

module.exports = Articles