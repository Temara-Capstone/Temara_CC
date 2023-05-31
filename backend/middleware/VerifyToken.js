const jwt = require('jsonwebtoken')

const VerifyToken = async (req, res, next) =>{
    const authHeader = req.headers.authorization
    console.log(authHeader)
    if(authHeader){
        const token = authHeader.split(' ')[1]
        if(token){
            try{
                req.user = jwt.verify(token, process.env.ACC_JWT_SECRET)
                next()
            }catch(error){
                res.status(401).json({message: 'Invalid Token'})
            }
        }
        else{
            res.status(401).json({message: 'No Token Provided'})
        }
    }
}

module.exports = VerifyToken