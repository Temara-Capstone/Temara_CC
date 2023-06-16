const jwt = require('jsonwebtoken')
const Users = require("../models/UserModel");

const refreshToken = async (req, res) =>{
    try {
        console.log(req.cookies.refreshBearerToken)
        const refBearerToken = req.cookies.refreshBearerToken
        await Users.getUserByWhere('refresh_bearer_token', refBearerToken, (err, results)=>{
            if(err) {
                res.status(404).json(err)
                return
            }
            jwt.verify(refBearerToken, process.env.REF_JWT_SECRET, (err)=>{
                if (err) {
                    res.status(403).json({
                        status: 'error',
                        error: true,
                        message: 'Forbidden',
                    });
                    return;
                }
                const userId = results[0].id
                const name = results[0].name
                const email = results[0].email
                const image = results[0].image
                const bearerToken = jwt.sign({userId, name, email}, process.env.ACC_JWT_SECRET, {expiresIn: '20s'})

                res.status(200).json({
                    status: 'success',
                    error: false,
                    results: {
                        userId: userId,
                        name: name,
                        image: image,
                        token: bearerToken
                    }
                    
                })
            })
        })
    }catch (e) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        })
    }
}

module.exports = refreshToken