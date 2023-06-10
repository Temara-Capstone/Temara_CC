const forum = require('../models/forumModel')
// const conn = require('../db/db')

const getThread = (req, res) => {
    forum.getAllThread((err, thread) => {
        if (err) throw err
        res.json(thread)
    }, res)
}

const getByThreadID = (req, res) => {

    forum.getThreadByID(req, (err, fields) => {
        if (err) {
            console.error(err)
            return res.status(404).json({
                status: 'error',
                message: 'Thread Not Found'
            })
        }
        if (fields.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Thread Not Found'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'Thread Found',
            result: fields
        })
    })

}

const getByUserID = (req, res) => {
    forum.getThreadByUser(req, (err, fields) => {
        if (err) {
            console.error(err)
            return res.status(404).json({
                status: 'error',
                message: 'User Not Found'
            })
        }
        if (fields.length === 0) {
            return res.status(400).json({
                status: 'error',
                message: 'User Not Found'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'User Found',
            result: fields
        })
    })
}

const postingThread = async (req, res) => {
    try {
        forum.postThread(req, (err) => {
            if (err) {
                res.status(401).json({
                    status: 'error',
                    message: 'Data invalid'
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    message: 'Data added'
                })
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: 'error', message: "Internal Server Error" })
    }
}

const updatingThread = async (req, res) => {
    try {
        forum.updateThread(req, (err) => {
            if (err) {
                res.status(401).json({
                    status: 'error',
                    message: 'Data invalid'
                })
            } else {
                res.status(200).json({
                    status: 'success',
                    message: 'Data updated'
                })
            }
        })
    } catch (e) {
        console.error(e)
        res.status(500).json({ status: 'error', message: "Internal Server Error" })
    }
}

const delThread = (req, res) => {
    forum.deleteThread(req, (err) => {
        if (err) {
            console.error(err)
        } else {
            res.status(201).send("Data deleted")
        }
    })
}


// const response = (statusCode, data, message, res) => {
//     res.json(statusCode, [
//         {
//             payload: data,
//             message,
//             metadata: {
//                 prev: "",
//                 next: "",
//                 current: "",
//             },
//         },
//     ])
// }

module.exports = { getByThreadID, getByUserID, getThread, postingThread, updatingThread, delThread }
