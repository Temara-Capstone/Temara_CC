const conn = require('../db/db')
const bcrypt = require('bcrypt')
const { v4: uuidv4} = require('uuid')
const storage = require('../middleware/gstorage')
const path = require('path')


const bucket = storage.bucket(process.env.BUCKET_PROFILE_IMAGE); // Get this from Google Cloud -> Storage



const Users = {
    // GET ALL USERS
    getAllUsers: (req, res) => {
        const query = 'SELECT * FROM users'
        conn.execute(query, (err, result) => {
            if (err){
                return res.status(500).json({
                    status: "error",
                    error: true,
                    message: "Internal Server Error"
                })
            }
            res.json(result)
            console.log(result)
            })
    },
    // UPDATE USER TOKEN
    updateUserToken: (req, callback) => {
        const id = req.id
        const token = req.token
        const query = 'UPDATE users SET refresh_bearer_token = ? WHERE id = ?'
        conn.execute(query, [token, id], (err, result)=>{
            if (err){
                callback(err, null)
            }
            callback(null, result)
        })
    },

    getUserByWhere: (column, condition, callback) => {
        const query = `SELECT * FROM users WHERE ${column} = ?`
        conn.execute(query, [condition], (err, results)=>{
            if (err){
                callback(err, null)
                return
            }
            callback(null, results)
        })
    },

    registerUser: async (req, res)=>{
        try{
            const { name, email, password} = req.body
            const gmailRegex = new RegExp("@gmail.com$");
            const isGmailEmail = gmailRegex.test(email)
            if(name === null || name === ""){
                return res.status(400).json({
                    status: 'error',
                    error: true,
                    message: 'Invalid Name. Name Required'
                })
            }
            if(!isGmailEmail){
                return res.status(400).json({
                    status: 'error',
                    error: true,
                    message: 'Invalid Email Domain'
                })
            }
            if(password.length <= 8){
                return res.status(400).json({
                    status: 'error',
                    error: true,
                    message: 'Password Required 8 Character or More'
                })
            }
            Users.getUserByWhere('email', email,  async (err, result) => {
                if (err) {
                    console.log(err)
                    res.status(400).json({
                        status: 'error',
                        error: true,
                        message: 'Bad request || Check your data input'
                    })
                }
                if (result.length > 0) {
                    return res.status(400).json({
                        status: 'success',
                        error: false,
                        message: 'email sudah terdaftar' });
                }
                // Continue with user registration process
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(password, salt)
                
                const defImage = "defaultImage.jpg"
                conn.execute(`INSERT INTO users (name, email, password, image)
                    VALUES ('${name}', '${email}', '${hash}', '${defImage}')`, (err) => {
                    if(err){
                        console.log(err)
                        res.status(400).json({
                            status: 'error',
                            error: true,
                            message: 'Bad request, check your data input'
                        })
                    }
                    res.status(200).json({
                        status: 'success',
                        error: false,
                        message: 'Registration success'
                    })
                })
            })
        }catch(e){
            console.error(e)
            res.status(500).json({ 
                status: 'error',
                error: true,
                message: "Internal Server Error" })
        }
    },
    
    changePassword: async (req, res)=>{
        try{
            const {id, newPassword} = req.body
            
            if(newPassword.length < 8){
                return res.status(400).json({
                    status: 'error',
                    error: true,
                    message: 'Password Required 8 Character or More',
                    data:{
                        lengthPassword: newPassword.length
                    }
                })
            }
            Users.getUserByWhere('id', id, async (err, result)=>{
                if(err){
                    console.log(err)
                    res.status(404).json({
                        status: "error",
                        error: true,
                        message: "User Not Found"
                    })
                    
                }
                
                const salt = await bcrypt.genSalt(10)
                const hash = await bcrypt.hash(newPassword, salt)

                const query = "UPDATE users SET password = ? WHERE id = ?"
                const params = [hash, id]
                conn.execute(query, params, (err)=>{
                    if(err){
                        console.log(err)
                        res.status(400).json({
                            status: "error",
                            error: true,
                            message: "Failed Update Password"
                        })
                    }
                    res.status(200).json({
                        status: "success",
                        error: false,
                        message: "Success Update Password"
                    })
                })
            })
        }catch(e){
            console.log(e)
            res.status(500).json({
                status: "error",
                error: true,
                message: "internal Server Error"
            })
        }
    },

    updateProfile: async (req, res)=>{
        const {id } = req.body
        try {
            console.log("Success");
        } catch (error) {
            res.send("Error:" + error);
        }
        console.log("Made it /upload");
        
        try {
        Users.getUserByWhere('id', id, async (err, user) => {
            if (user.length === 0) {
            return res.status(404).json({
                status: 'error',
                error: true,
                message: 'User Not Found',
            });
            }

            if(user[0].image !== 'defaultImage.jpg'){
                const fileName = user[0].image
                const file = bucket.file(fileName)

                //check if file exists
                const exists = await file.exists()
                if (!exists[0]) {
                    console.log('File does not exist.');
                    return;
                }
                await file.delete()
                console.log('File deleted successfully.');
            }

            const { name, email, gender, dateofbirth, no_hp } = req.body;
            const updatedUser = {
            name: name || user[0].name,
            email: email || user[0].email,
            gender: gender || user[0].gender,
            dateofbirth: dateofbirth || user[0].dateofbirth, // Assuming the dateofbirth is provided in 'YYYY-MM-DD' format
            no_hp: no_hp || user[0].no_hp,
            image: user[0].image,
            };
            
    
            // ... rest of the code for handling the image upload and updating the profile ...
            // Upload the image to Google Cloud Storage
            if (req.file) {
                const postid = uuidv4()
                // Extract the file extension from the original file name
                const fileExtension = path.extname(req.file.originalname);

                // Generate the new file name using the post ID and file extension
                const newFileName = `${postid}_profile${fileExtension}`;
                console.log("File found, trying to upload...");
                const blob = bucket.file(newFileName);
                const blobStream = blob.createWriteStream();
                console.log(blob)

                blobStream.on("finish", () => {
                    res.status(200).send("Success");
                    console.log("Success");
                });
                blobStream.end(req.file.buffer);
                updatedUser.image = newFileName;        
                
                // Continue with the rest of the code (performing SQL update query, sending response, etc.)
                // Perform the SQL update query
                const query = 'UPDATE users SET name = ?, email = ?, gender = ?, dateofbirth = ?, no_hp = ?, image = ? WHERE id = ?';
                const values = [
                    updatedUser.name,
                    updatedUser.email,
                    updatedUser.gender,
                    updatedUser.dateofbirth,
                    updatedUser.no_hp,
                    updatedUser.image,
                    id,
                ];

                conn.execute(query, values, (err) => {
                    if (err) {
                    console.error(err);
                    return res.status(500).json({
                        status: 'error',
                        error: true,
                        message: 'Internal Server Error',
                    });
                    }
                    res.status(200).json({
                        status: 'success',
                        error: false,
                        message: 'Profile Updated'
                        })
                    })
                
            } else {
                // If no file is uploaded, perform the SQL update query without updating the image field
                const query = 'UPDATE users SET name = ?, email = ?, gender = ?, dateofbirth = ?, no_hp = ? WHERE id = ?';
                const values = [
                updatedUser.name,
                updatedUser.email,
                updatedUser.gender,
                updatedUser.dateofbirth,
                updatedUser.no_hp,
                id,
                ];

                conn.execute(query, values, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({
                        status: 'error',
                        error: true,
                        message: 'Internal Server Error',
                        });
                    }
                    res.status(200).json({
                        status: 'success',
                        error: false,
                        message: 'Profile Updated'
                    });
                });
            }
            
        })
        }catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
        }
    }
}

module.exports = Users