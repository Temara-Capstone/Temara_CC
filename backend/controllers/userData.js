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
                message: 'User Not Found'
            })
        }
        res.status(200).json({
            status: 'success',
            message: 'User Found',
            result: results
        })
    })
}



const registrasi = async (req, res) => {
    try{

        const { email} = req.body
        Users.getUserByWhere('email', email,  async (err, result) => {
            if (err) {
                throw err;
            }
            if (result.length > 0) {
                return res.json({ msg: 'email sudah terdaftar' });
            }
            // Continue with user registration process
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(req.body.password, salt)

            await Users.registerUser(req, hash, (err)=>{
                if(err){
                    res.status(401).json({
                        status: 'error',
                        message: 'Data invalid'
                    })
                }else{
                    res.status(200).json({
                        status: 'success',
                        message: 'Data added'
                    })
                }
            })
        })
    }catch(e){
        console.error(e)
        res.status(500).json({ status: 'error', message: "Internal Server Error" })
    }

}


const authUser = (req, res) => {
    try{
        console.log(req.body)
        const password = req.body.password
        Users.getUserByWhere('email', req.body.email,async (err, result) =>{
            if(err) throw err
            console.log(result)
            const userId = result[0].id
            const name = result[0].name
            const email = result[0].email
            const isMatch = await bcrypt.compare(password, result[0].password);
            if(!isMatch) return res.status(400).json({ message: "Password Salah"})
            
            const bearerToken = jwt.sign({userId, name, email}, process.env.ACC_JWT_SECRET, { expiresIn: "15s"})
            const refreshBearerToken = jwt.sign({userId, name, email}, process.env.REF_JWT_SECRET, { expiresIn: "1d"})

            Users.updateUserToken({id:userId, token:refreshBearerToken},(err)=>{
                if(err) return res.status(500).json({
                    status: 'error',
                    message: 'Internal Server Error'
                })
            })
            res.cookie('refreshBearerToken', refreshBearerToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000
            })
            res.status(200).json({
                status: 'success',
                data: {
                    userId: userId,
                    bearerToken: bearerToken
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
    conn.query(`DELETE FROM user WHERE id = ${id}`, (err) => {
        if (err) {
            console.error(err)
            }else{
                res.status(201).send("Data berhasil dihapus")
            }
            
        })
}

const logout = async (req, res)=>{
    try{
        const refBearerToken = req.cookies.refreshBearerToken
        await Users.getUserByWhere('refresh_bearer_token', refBearerToken, (err, results)=>{
            if(err){
                res.status(404).json({
                    status: 'error',
                    message: 'User Not Found'
                })
            }
            Users.updateUserToken({ userId: results[0].id, refBearerToken: null},(err)=>{
                if(err){
                    res.status(404).json({
                        status: 'error',
                        message: 'User Not Found'
                    })
                }
            })
            res.clearCookie('refreshBearerToken')
            res.status(200).json({
                status: 'success',
                message: 'Berhasil Logout'
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

const profile = async (req, res)=>{
    try{
        const userId = req.params.id
        await Users.getUserByWhere('id', userId, (err, results)=>{
            if(err){
                res.status(401).json({
                    status: 'error',
                    message: 'Invalid'
                })
            }
            console.log(results)
            res.status(200).json({
                status: 'success',
                message: 'User Found',
                result: results[0]
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



module.exports = { registrasi, getAllUser, delUserData, authUser, logout, profile, getUserById}