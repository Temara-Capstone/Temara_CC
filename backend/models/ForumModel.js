const conn = require('../db/db')
const uuid = require('uuid')
const moment = require('moment')

const Forum = {
    postThreadUser : (req, callback)=>{
        try{
            console.log(req.body)
            const {userId , thread} = req.body
            const threadId = uuid.v4()
            const today = Date.now()
            const date = new Date(today)
            console.log(date)
            const query = `INSERT INTO forum (id_thread, id_user, thread, createdAt)
                                VALUES ('${threadId}', '${userId}', '${thread}','${moment().format("YYYY/MM/DD")}')`
            conn.query(query, (err, result)=>{
                if(err){
                    console.error(err)
                    callback(err, null)
                }
                console.log(result)
                callback(null, {
                    threadId: threadId,
                    userId: userId,
                    thread: thread})
            })
        }catch (e) {
            console.error(e)
            callback()
        }
    },


}


module.exports = Forum