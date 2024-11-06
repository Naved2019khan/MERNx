const USERS = require("../models/userModal")
const requireKey = require("../libs/requireKey")
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const dotenv = require("dotenv")
dotenv.config()

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body

        requireKey(req, res, "name");
        requireKey(req, res, "email");
        requireKey(req, res, "password");

        const userExist = await USERS.findOne({ email: email })

        if (userExist) return res.status(401).send({ message: "user already exist" })

        const hashPassword = await bcrypt.hash(password, 10)
        const user = new USERS({ name, email, password: hashPassword })
        await user.save()

        res.status(200).send({
            message: "Sign Up Successful",
            user
        })
    } catch (error) {
        res.status(401).send({
            err: error?.message
        })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body

        requireKey(req, res, "email");
        requireKey(req, res, "password");

        const user = await USERS.findOne({ email })
        if (!user) { return res.status(402).send({ message: 'User Not Exist' }) }

        let hashPassword = user.password
        const compare = await bcrypt.compare(password, hashPassword)
        if (!compare) return res.status(401).send({ message: 'Password Not Match', compare })

        const token = jwt.sign({user}, process.env.JWT_TOKEN)

        res.status(200).send({
            message: "sign in successful",
            token
        })

    } catch (error) {
        res.status(500).send({
            message: "got error",
            error: error?.message
        })
    }

}

const getUser = async (req, res) => {
    try {
        const { _id } = req.user
        const user = await USERS.findById({ _id })

        if (!user) return res.status(404).send({ message: "User Not Exist" })

        res.status(200).send({
            message: "current user",
            user
        })

    } catch (error) {
        res.status(500).send({
            message: "got error",
            error: error?.message
        })
    }
}

// const forgotPassword = async (req, res) => {
//     try {
//         const { email ,setTime } = req.body

//         requireKey(req, res, "email");

//         const user = await USERS.findOne({ email: email })

//         if (!user) return res.status(401).send({ message: "user already exist" })

//         const resetToken = crypto.randomBytes(32).toString('hex');
//         // user.resetPasswordToken = resetToken;
//         // user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//         // await user.save();

//         // Send email with nodemailer
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             secure: true,
//             port: 465,
//             auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
//         });


//         const sendEmail = () => {
//             const reciever = {
//                 // from : process.env.EMAIL,
//                 to: `${email} , naved2019khan@gmail.com`,
//                 subject: 'Password Reset',
//                 text: `Reset your password using this token: ${resetToken}`,
//             };

//             transporter.sendMail(reciever, (error) => {
//                 if (error) return res.status(500).json({ message: "Error sending email", error });
//                 // res.status(200).send({ message: "Reset email sent" });
//             });
//         }

//         const now = new Date();
//         const t = new Date(setTime)
//         const delay = new Date(setTime) - now;
//         console.log(t.toISOString() , "and" , new Date() )

//         if (delay > 0) {
//             setTimeout(sendEmail, delay);
//             console.log(`Email scheduled to be sent in ${delay / 1000} seconds.`);
//         } else {
//             console.log("Target time is in the past. Please choose a future time.");
//         }

//          res.status(200).send({ message: "timer set" });

//     }
//     catch (error) {
//         res.status(500).send({
//             message: "Got Error",
//             error: error?.message
//         })
//     }
// }

const forgotPassword = async (req,res) =>{
    try{
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            port: 465,
            auth: { user: process.env.EMAIL, pass: process.env.PASSWORD },
        });

        const { email } = req.body
        
        const user = await USERS.findOne({email})
        
        if(!user) return res.status(404).send({message : "User Not Found"});
        
        const token = jwt.sign({id : user._id},process.env.JWT_TOKEN)
        const link = `http://localhost:3000/reset-password/${token}`
        // const link = "sd"
        
        await transporter.sendMail({
        from: process.env.EMAIL,
        to: "test@gmail.com",
        subject: "Password Reset",
        text: `Click here to reset your password: ${link}`,
      });
    
      res.send("Password reset link sent to your email.");
    }
    catch(error){
        res.status(500).send({
            message : "Internal Server Error",
            error : error?.message
        })
    }

}  

const resetPassword = async (req, res) => {
    try {
        const {token} = req.params;
        const { password  } = req.body;

        const payload = jwt.verify(token, process.env.JWT_TOKEN);

        console.log(payload)
        
        const user = await USERS.findById({ _id: payload.id })
        if (!user) return res.status(404).send({ message: "User Not Exist" })

        const hashPassword = await bcrypt.hash(password,10)
        user.password = hashPassword
        await user.save()



        res.status(200).send({
            message: "Password Set Successfully",
            user
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send({
            message: "got error",
            error: error?.message
        })
    }
}

const getUserById = async (req, res) => {
    try {
        const { id } = req.body
        const user = await USERS.findById({ _id: id }, { _id: 0, email: 1, name: 1 })

        if (!user) return res.status(404).send({ message: "User Not Exist" })

        res.status(200).send({
            message: "current user",
            user
        })

    } catch (error) {
        res.status(500).send({
            message: "got error",
            error: error?.message
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const user = await USERS.find()

        if (!user) return res.status(404).send({ message: "User Not Exist" })

        res.status(200).send({
            message: "All User",
            user
        })

    } catch (error) {
        res.status(500).send({
            message: "got error",
            error: error?.message
        })
    }
}

const USER = {
    signIn,
    signUp,
    forgotPassword,
    getUserById,
    getAllUser,
    getUser,
    resetPassword
}

module.exports = USER