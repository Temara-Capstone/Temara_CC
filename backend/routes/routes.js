const {
    delUserData,
    authUser,
    getAllUser,
    registrasi,
    logout,
    profile,
    getUserById
}  = require('../controllers/userData')
const {
    getByThreadID, getByUserID, getThread, postingThread, updatingThread, delThread
}  = require('../controller/forumController')

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
    app.get('/api/users/user/:id', getUserById)
    app.get('/api/articles', getAllArticles)
    app.get('/api/articles/:id', getArticleById)
    app.get('/api/quotes', getRandomQuotes)
    app.get('/api/forum', getThread)
    app.get('/api/forum/:id', getByThreadID)
    app.get('/api/forum/user/:user_id', getByUserID)
    app.post('/api/forum', postingThread)
    app.put('/api/forum/:id', updatingThread)
    app.delete('/api/forum/:id', delThread)
}

module.exports = setupRoutes
