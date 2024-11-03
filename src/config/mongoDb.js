const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const  MONGODB_URI = process.env.MONGODB_URI

const connection = async () =>{
    try {
        let connect = await mongoose.connect(MONGODB_URI) 
        // console.log("DB",connect.connection.host)
        console.log("DB Name",connect.connection.name)
    } catch (error) {
        console.log("DB ERROR",error)
    }
 }



module.exports = connection
