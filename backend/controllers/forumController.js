const Forum = require('../models/ForumModel')

const postThread = (req,res)=>{
    try{
        Forum.postThreadUser(req, (err, result)=>{
            if(err){
                console.error(err)
                res.status(401).json({
                    status: 'error',
                    message: 'Data Invalid'
                })
            }
            res.status(200).json({
                status: 'success',
                message: 'Data Thread Successfully Created',
                result: result
            })
        })
    }catch (e) {
        console.error(e)
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error'
        })
    }
}

module.exports = { postThread }