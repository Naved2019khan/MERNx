const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

const authenticateToken = async (req,res,next)=>{
    let authHeader = req.headers["authorization"]
    token = authHeader && authHeader.split(" ")[1]

    if(!token) return res.status(401).send({message : "Auth Token not provided"})

    jwt.verify(token,process.env.JWT_TOKEN,(err,decoded)=>{
        if(err) return {message : "Error token",error : err?.message}

        req.user = decoded.user
        next()
    })
}

module.exports = authenticateToken