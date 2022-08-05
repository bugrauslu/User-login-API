const router = require("express").Router();
const auth = require("../Controller/auth");
const {verifyToken , verifyTokenAndAuthorization, verifyTokenAndAdmin} = require("../Middlewares/VerifyToken");
const {verifyRegister , verifyLogin, verifyUpdate} = require("../Controller/Verification")



//REGISTER
router.post("/register",verifyRegister,auth.registerUser);

//EMAIL CONFIRMATION
router.get("/verify",auth.emailConfirm);

//USER LOGIN
router.post("/login",verifyLogin, auth.login);

//LOGGED IN USER INFORMATION
router.get("/me/:id", verifyTokenAndAuthorization , auth.userInfo);

// LOGGED IN USER INFORMATION UPDATE 
router.put("/me/update/:id", verifyTokenAndAuthorization, verifyUpdate, auth.userUpdate)

//USER DELETE
router.delete("/delete/:id",verifyTokenAndAuthorization,auth.deleteUser)

//ADMIN GET ALL USERS
router.get("/allusers",verifyTokenAndAdmin,auth.allUsers)













module.exports = router;