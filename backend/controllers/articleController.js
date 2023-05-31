const Articles = require('../models/articleModel')

const getAllArticles = (req, res)=>{
    Articles.getAllArticle(req, res)
}

const getArticleById = (req, res) => {
    Articles.getArticleById(req, res, (err, results)=>{
        if(err){
            console.error(err)
            res.status(404).json({
                status: 'error',
                message: 'Article Not Found'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'Get Article By Id Found',
            result: results
        })
    })
}
module.exports = { getAllArticles, getArticleById }