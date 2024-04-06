const conn = require('../db/db')
const Users = require('../models/UserModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')



const getAllUser = (req,res)=>{
    Users.getAllUsers((err, users)=>{
        if(err) throw err
        res.json(users)
    }, res)
}

const getUserById = (req, res)=>{
    const id = req.params.id
    Users.getUserByWhere('id', id, (err, results)=>{
        if(err){
            console.error(err)
            res.status(404).json({
                status: 'error',
                error: true,
                message: 'User Not Found'
            })
        }
        res.status(200).json({
            status: 'success',
            error: false,
            message: 'User Found',
            result: results
        })
    })
}



const registrasi = async (req, res) => {
    Users.registerUser(req,res)
}


const authUser = (req, res) => {
    try{
        console.log(req.body)
        const password = req.body.password
        const email = req.body.email
        const gmailRegex = new RegExp("@gmail.com$");
        const isGmailEmail = gmailRegex.test(email)
        if(!isGmailEmail){
            return res.status(400).json({
                status: 'error',
                error: true,
                message: 'Invalid Email Domain'
            })
        }
        Users.getUserByWhere('email', email,async (err, result) =>{
            if(err) throw err
            console.log(result)
            const userId = result[0].id
            const name = result[0].name
            const image = result[0].image
            const email = result[0].email
            const isMatch = await bcrypt.compare(password, result[0].password);
            if(!isMatch) return res.status(400).json({ 
                status: 'error',
                error: true,
                message: "Wrong Password"
            })
            
            const bearerToken = jwt.sign({userId, name, email}, process.env.ACC_JWT_SECRET, { expiresIn: "30d"})
            const refreshBearerToken = jwt.sign({userId, name, email}, process.env.REF_JWT_SECRET, { expiresIn: "1d"})

            Users.updateUserToken({id:userId, token:refreshBearerToken},(err)=>{
                if(err) return res.status(500).json({
                    status: 'error',
                    error: true,
                    message: 'Internal Server Error'
                })
            })
            res.cookie('refreshBearerToken', refreshBearerToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                status: 'success',
                error: false,
                data: {
                    userId: userId,
                    name: name,
                    image: image,
                    token: bearerToken
                }
            })
        })
    }catch(e){
        console.error(e)
        res.status(500).send("Internal server error")
    }
}
        
function delUserData(req, res){
    const id = req.params.id
    conn.execute(`DELETE FROM user WHERE id = ${id}`, (err) => {
        if (err) {
            console.error(err)
            }else{
                res.status(201).send("Data berhasil dihapus")
            }
            
        })
}

const logout = async (req, res)=>{
    try{
        const token = req.cookies.refreshBearerToken
        await Users.getUserByWhere('refresh_bearer_token', refBearerToken, (err, results)=>{
            if(err){
                res.status(404).json({
                    status: 'error',
                    error: true,
                    message: 'User Not Found'
                })
            }
            Users.updateUserToken({ id: results[0].id, token: null},(err)=>{
                if(err){
                    res.status(404).json({
                        status: 'error',
                        error: true,
                        message: 'User Not Found'
                    })
                }
            })
            res.clearCookie('refreshBearerToken')
            res.status(200).json({
                status: 'success',
                error: false.valueOf,
                message: 'Berhasil Logout'
            })
        })
    }catch (e) {
        console.error(e)
        res.status(500).json({
            status: 'error',
            error: true,
            message: 'Internal Server Error'
        })
    }
}

const profile = async (req, res)=>{
    try{
        const userId = req.params.id
        Users.getUserByWhere('id', userId, (err, results)=>{
            if(err){
                res.status(401).json({
                    status: 'error',
                    error: true,
                    message: 'Invalid'
                })
            }
            console.log(results)
            res.status(200).json({
                status: 'success',
                error: false,
                message: 'User Found',
                result: {
                    userId: results[0].id,
                    name: results[0].name,
                    email: results[0].email,
                    gender: results[0].gender,
                    dateofbirth: results[0].dateofbirth,
                    no_hp: results[0].no_hp,
                    image: `https://storage.googleapis.com/profile-image-042/${results[0].image}`,
                }
            })
        })
    }catch (e) {
        console.error(e)
        res.status(500).json({
            status: 'error',
            error: true,
            message: 'Internal Server Error'
        })
    }
}


const updateProfile = async (req, res) => {
    try{
        Users.updateProfile(req,res)  
    }catch(e){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
};

const changePassword = (req, res)=>{
    try{
        Users.changePassword(req, res)
        
    }catch(e){
        console.error(err);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
}

module.exports = { registrasi, getAllUser, delUserData, authUser, logout, profile, getUserById, updateProfile, changePassword}
