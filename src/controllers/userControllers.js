const USERS = require("../models/userModal")
const requireKey = require("../libs/requireKey")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")

const signUp =  async (req, res) => {
        try{
            const {name, email, password } = req.body
            
            requireKey(req,res,"name");
            requireKey(req,res,"email");
            requireKey(req,res,"password");

            const userExist = await USERS.findOne({email : email})

            if(userExist) return res.status(401).send({message : "user already exist"})

            const hashPassword = await bcrypt.hash(password,10)
            const user = new USERS({name , email , password : hashPassword})
            await user.save()
            
            res.status(200).send({
                message: "Sign Up Successful",
                user
            })
        }catch(error){
            res.status(401).send({
                err : error?.message
            })
        }
    }
    
const signIn = async (req, res) => {
    try{
        const { email, password } = req.body
        
        requireKey(req,res,"email") ;
        requireKey(req,res,"password") ;

        const user = await USERS.findOne({email})
        if(!user) { return res.status(402).send({message : 'User Not Exist'}) }
        
        let hashPassword = user.password
        const compare =  await bcrypt.compare(password,hashPassword)
        if(!compare) return res.status(401).send({message : 'Password Not Match' ,compare})
            
        const token  = jwt.sign(user,process.env.JWT_TOKEN)

        res.status(200).send({
            message: "sign in successful",
            token 
            
        })

    }catch(error){
        res.status(500).send({
            message : "got error",
            error : error?.message
        })
    }

    }

const getUser = async (req, res) => {
    try{
        const { _id } = req.user
        const user = await USERS.findById({_id})

        if(!user) return res.status(404).send({message : "User Not Exist"})        

        res.status(200).send({
            message: "current user",
            user
        })

    }catch(error){
        res.status(500).send({
            message : "got error",
            error : error?.message
        })
    }   
}
    
const forgotPassword = async (req, res) => {
        res.status(200).send({
            message: "password send successfully"
        })
    }


const getUserById = async (req, res) => {
        try{
            const { id } = req.body
            const user = await USERS.findById({_id : id} , {_id : 0 , email : 1 , name : 1 })
    
            if(!user) return res.status(404).send({message : "User Not Exist"})        
    
            res.status(200).send({
                message: "current user",
                user
            })
    
        }catch(error){
            res.status(500).send({
                message : "got error",
                error : error?.message
            })
        }   
}

const getAllUser = async (req, res) => {
        try{
            const user = await USERS.find()
    
            if(!user) return res.status(404).send({message : "User Not Exist"})        
    
            res.status(200).send({
                message: "All User",
                user
            })
    
        }catch(error){
            res.status(500).send({
                message : "got error",
                error : error?.message
            })
        }   
}

const USER = {
    signIn,
    signUp,
    forgotPassword,
    getUserById,
    getAllUser,
    getUser
}

module.exports = USER