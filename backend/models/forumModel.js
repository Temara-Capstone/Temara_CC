const conn = require('../db/db')
const storage = require('../middleware/gstorage')
const { v4: uuidv4 } = require('uuid')
const path = require('path')

//GET BUCKET FROM GOOGLE STORAGE BUCKET
const bucket = storage.bucket(process.env.BUCKET_POST_IMAGE)

const forum = {
    // GET ALL THREAD
    getAllThread: (req, res) => {
        const sql = "SELECT * FROM forum"
        conn.execute(sql, (err, fields) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    error: true,
                    message: "Internal Server Error"
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

            //response(200, fields, "data post", res)
            res.status(200).json({
                status: 'success',
                error: false,
                message: 'Show All Post Forum',
                results: formatedResult
            })
        })
    },
    // GET THREAD BY ID THREAD
    getThreadByID: (req, res) => {
        const id = req.params.id
        const sql = `SELECT * FROM forum WHERE id = ${id}`
        conn.execute(sql, (err, fields) => {
            if (err) {
                res(err, null)
                return
            }
            res(null, fields)
        })
        // response(200, fields, `all detail post from ${id}`, res)
    },
    // GET THREAD BY ID USER
    getThreadByUser: (req, res) => {
        const user_id = req.params.user_id
        const sql = `SELECT * FROM forum WHERE user_id = ${user_id}`
        conn.execute(sql, (err, fields) => {
            if (err) {
                res(err, null)
                return
            }
            res(null, fields)
        })
        // if (err) throw err
        // response(200, fields, `all detail post from ${user_id}`, res)
    },
    // POST THREAD
    postThread: async (req, res) => {
        try {
            let image = null            
            if(req.file){
                const postid = uuidv4()
                // Extract the file extension from the original file name
                const fileExtension = path.extname(req.file.originalname);

                // Generate the new file name using the post ID and file extension
                const newFileName = `${postid}_post${fileExtension}`;
                console.log("File found, trying to upload...");
                const blob = bucket.file(newFileName);
                const blobStream = blob.createWriteStream();
                console.log(blob)

                blobStream.on("finish", () => {
                    console.log("Success");
                });
                blobStream.end(req.file.buffer);
                image = newFileName;
            }
            const { user_id, text } = req.body
            const sql = `INSERT INTO forum (user_id, text, images) VALUES (${user_id}, '${text}', '${image}')`

            conn.execute(sql, (err, fields) => {
                if (err) {
                    res(err, null)
                } else {
                    res(null, fields)
                }
            })
            
        } catch (e) {
            console.error(e)
            res(e, null)
        }
    },
    // UPDATE THREAD
    updateThread: async (req, res) => {
        const id = req.params.id
        const text = req.body.text
        try {
            const results = await new Promise((resolve, reject) => {
                forum.getThreadByID(req, (err, results) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(results);
                  }
                });
            });
            
            //check if post exists
            if(results){
                console.log(results)
                const resultImage = results[0].images
                let image = null
                if(req.file){
                    const postid = uuidv4()
                    // Extract the file extension from the original file name
                    const fileExtension = path.extname(req.file.originalname);

                    // Generate the new file name using the post ID and file extension
                    const newFileName = `${postid}_post${fileExtension}`;
                    console.log("File found, trying to upload...");
                    const blob = bucket.file(newFileName);
                    const blobStream = blob.createWriteStream();
                    console.log(blob)

                    blobStream.on("finish", () => {
                        console.log("Success");
                    });
                    blobStream.end(req.file.buffer);
                    image = newFileName;
                }
        
                fileName = resultImage
                console.log(fileName)
                if(fileName !== 'null'){

                    const file = bucket.file(fileName)

                    //check if file exists
                    const exists = await file.exists()
                    if (!exists[0]) {
                        console.log('File does not exist.');
                    }else{
                        await file.delete()
                        console.log('File deleted successfully.');
                    }                   
                }

                    
                const sql = `UPDATE forum SET text = '${text}', images = '${image}', updated_at = current_timestamp() WHERE id = ${id}`

                conn.execute(sql, (err, fields) => {
                    if (err) {
                        res(err, null)
                    } else {
                        res(null, fields)
                    }
                })
            }
        } catch (e) {
            console.error(e)
            res(e, null)
        }
    },
    deleteThread: (req, res) => {
        try {
            const id = req.params.id
            const sql = `DELETE FROM forum WHERE id = ${id}`
            conn.execute(sql, (err, fields) => {
                if (err) {
                    res(err, null)
                } else {
                    res(null, fields)
                }
            })
        } catch (e) {
            console.error(e)
            res(e, null)
        }

    }


}

module.exports = forum
