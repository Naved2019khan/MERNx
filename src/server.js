const express = require("express")
const dotenv = require("dotenv")
const connectionDb = require("./config/mongoDb.js")
dotenv.config()

connectionDb();

const app = express()
const PORT = process.env.PORT || 5000
app.use(express.json())

app.use("/user",require("./routes/user.js"))


app.listen(PORT ,()=>{
    console.log("SERVER RUNNING on http://localhost:" + PORT)
})
