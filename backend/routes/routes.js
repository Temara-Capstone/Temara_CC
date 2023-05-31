const {
    delUserData,
    authUser,
    getAllUser,
    registrasi,
    logout,
    profile,
    getUserById
}  = require('../controllers/userData')

const VerifyToken = require('../middleware/VerifyToken')
const refreshToken = require('../middleware/RefreshToken')
const {postThread} = require("../controllers/forumController");
const {
    getAllArticles,
    getArticleById
} = require("../controllers/articleController");
const {getRandomQuotes} = require("../controllers/quotesModel");
const setupRoutes = (app)=>{
    app.get('/api/users', VerifyToken, getAllUser)
    app.post('/api/users/register', registrasi)
    app.post('/api/users/auth', authUser)
    app.delete('/api/users/delete/:id', (req, res)=>{
        delUserData(req, (result)=>{
            res.json(result)
        })
    })
    app.get('/api/token', refreshToken)
    app.delete('/api/logout', logout)
    app.get('/api/users/profile/:id', profile)
    app.post('/api/forum', postThread)
    app.get('/api/users/user/:id', getUserById)
    app.get('/api/articles', getAllArticles)
    app.get('/api/articles/:id', getArticleById)
    app.get('/api/quotes', getRandomQuotes)
}

module.exports = setupRoutes