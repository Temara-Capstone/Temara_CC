const {
    delUserData,
    authUser,
    getAllUser,
    registrasi,
    logout
}  = require('../controllers/userData')

const VerifyToken = require('../middleware/VerifyToken')
const refreshToken = require('../middleware/RefreshToken')
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
}

module.exports = setupRoutes