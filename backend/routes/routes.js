const {
    delUserData,
    authUser,
    getAllUser,
    registrasi,
    logout,
    profile,
    getUserById,
    updateProfile,
    changePassword
}  = require('../controllers/userData')

const VerifyToken = require('../middleware/VerifyToken')
const refreshToken = require('../middleware/RefreshToken')
const {
    getByThreadID, getByUserID, getThread, postingThread, updatingThread, delThread
}  = require('../controllers/forumController')
const {
    getAllArticles,
    getArticleById,
    searchArticles
} = require("../controllers/articleController");
const {getRandomQuotes} = require("../controllers/quotesModel");
// const multer = require('multer')
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//       cb(null, file.originalname);
//     }
//   });
// Create multer upload instance
const upload = require('../middleware/multerConfig');
const setupRoutes = (app)=>{
    app.get('/api/users', VerifyToken, getAllUser)
    app.post('/api/register', upload.none(), registrasi)
    app.post('/api/login', upload.none(), authUser)
    app.delete('/api/users/delete/:id', (req, res)=>{
        delUserData(req, (result)=>{
            res.json(result)
        })
    })
    app.get('/api/token', refreshToken)
    app.delete('/api/logout', VerifyToken, logout)
    app.get('/api/profile/:id', VerifyToken, profile)
    app.get('/api/forum', VerifyToken, getThread)
    app.get('/api/forum/:id', VerifyToken, getByThreadID)
    app.get('/api/forum/user/:user_id', VerifyToken, getByUserID)
    app.post('/api/forum/post', VerifyToken, upload.single('image'), postingThread)
    app.put('/api/forum/update/:id', VerifyToken, upload.single('image'), updatingThread)
    app.delete('/api/forum/delete/:id', VerifyToken, delThread)
    app.get('/api/users/:id', VerifyToken, getUserById)
    app.get('/api/articles', VerifyToken, getAllArticles)
    app.get('/api/articles/:id', VerifyToken, getArticleById)
    app.get('/api/quotes', VerifyToken, getRandomQuotes)
    app.put('/api/profile/update', VerifyToken, upload.single('image'), updateProfile)
    app.put('/api/changePassword', VerifyToken, upload.none(), changePassword)
    app.get('/api/search/:search', VerifyToken, upload.none(), searchArticles)
}

module.exports = setupRoutes