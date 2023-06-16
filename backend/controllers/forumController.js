const forum = require('../models/forumModel')
// const conn = require('../db/db')

const getThread = (req, res) => {
    try{
        forum.getAllThread(req, res)
    }catch(e){
        console.log(e)
        res.status(500).json({
            status: 'error',
            error: true,
            message: 'Internal Server Error'
        })
    }
}

const getByThreadID = (req, res) => {

    forum.getThreadByID(req, (err, fields) => {
        if (err) {
            console.error(err)
            return res.status(404).json({
                status: 'error',
                error: true,
                message: 'Thread Not Found'
            })
        }
        if (fields.length === 0) {
            return res.status(400).json({
                status: 'error',
                error: true,
                message: 'Thread Not Found'
            })
        }
        
        const field = fields[0]
        res.status(200).json({
            status: 'success',
            error: false,
            message: 'Thread Found',
            result:{
                id: field.id,
                user_id: field.user_id,
                text: field.text,
                image: `https://storage.googleapis.com/${process.env.BUCKET_POST_IMAGE}/${field.images}`,
                createdAt: field.created_at,
                updatedAt: field.updated_at
            }
        })
    })

}

const getByUserID = (req, res) => {
    forum.getThreadByUser(req, (err, fields) => {
        if (err) {
            console.error(err)
            return res.status(404).json({
                status: 'error',
                error: true,
                message: 'User Not Found'
            })
        }
        if (fields.length === 0) {
            return res.status(400).json({
                status: 'error',
                error: true,
                message: 'User Not Found'
            })
        }

        const formatedResult = fields.map((field)=>{
            if(field.images === 'null'){
                return{
                    id:field.id,
                    user_id:field.user_id,
                    text:field.text,
                    images:`${field.images}`,
                    createdAt:field.created_at,
                    updatedAt:field.updated_at
                }                
            }else{
                    return{
                    id:field.id,
                    user_id:field.user_id,
                    text:field.text,
                    images:`https://storage.googleapis.com/${process.env.BUCKET_POST_IMAGE}/${field.images}`,
                    createdAt:field.created_at,
                    updatedAt:field.updated_at
                }
            }
        })

        res.status(200).json({
            status: 'success',
            error: false,
            message: 'Thread Found',
            result: formatedResult
        })
    })
}

const postingThread = async (req, res) => {
    try {
        forum.postThread(req, (err) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    error: true,
                    message: 'Data invalid'
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    error: false,
                    message: 'Data added'
                })
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ 
            status: 'error',
            error: true,
            message: "Internal Server Error" })
    }
}

const updatingThread = async (req, res) => {
    try {
        forum.updateThread(req, (err) => {
            if (err) {
                res.status(400).json({
                    status: 'error',
                    error: true,
                    message: 'Data invalid'
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    error: false,
                    message: 'Data updated'
                })
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ 
            status: 'error',
            error: true, 
            message: "Internal Server Error" })
    }
}

const delThread = (req, res) => {
    forum.deleteThread(req, (err) => {
        if (err) {
            console.error(err)
            res.status(201).json({
                status: 'success',
                error: false,
                message: 'Data Deleted'
            })
        } else {
            res.status(200).json({
                status: 'success',
                error: false,
                message: 'Data Deleted'
            })
        }
    })
}


module.exports = { getByThreadID, getByUserID, getThread, postingThread, updatingThread, delThread }
