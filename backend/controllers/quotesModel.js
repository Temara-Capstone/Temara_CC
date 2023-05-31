const Quotes = require('../models/quotesModel')

const getRandomQuotes = (req, res)=>{
    Quotes.getRandomQuotes(req,res)
}

module.exports = { getRandomQuotes }