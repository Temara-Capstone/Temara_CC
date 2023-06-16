const Articles = require('../models/articleModel')

const getAllArticles = (req, res)=>{
    Articles.getAllArticle(req, res)
}

const getArticleById = (req, res) => {
    Articles.getArticleById(req, res)
}

const searchArticles = (req, res) =>{
    Articles.searchArticles(req, res)
}
module.exports = { getAllArticles, getArticleById, searchArticles }