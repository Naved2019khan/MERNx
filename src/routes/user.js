const express = require("express")

const router = express.Router()
const USER = require("../controllers/userControllers")
const authenticateToken = require("../middleware/authenticateToken")

router.post("/sign-in",USER.signIn)
router.post("/sign-up",USER.signUp)
router.post("/forgot-password",USER.forgotPassword)
router.post("/get-user-id",USER.getUserById)
router.post("/get-login-user",authenticateToken,USER.getUser)
router.post("/get-all-user",USER.getAllUser)

module.exports = router