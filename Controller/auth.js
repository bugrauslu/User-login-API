const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt')
const User = require("../Models/User_Model");
const Joi = require("joi");
const nodemailer = require('nodemailer');



//REGISTER USER
const registerUser = async(req,res,next)=>{
        const hashpassword =  await bcrypt.hash(req.body.password, 10)
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashpassword
        })
        
        try {

            const savedUser = await newUser.save()
            jwtinformation={
                id:savedUser.id,
                mail:savedUser.email
            }
            const jwttoken = jwt.sign(jwtinformation,process.env.JWTSECRETKEY,{expiresIn:'1d'});
            const url = process.env.WEBSITEURL+'api/verify?id='+jwttoken;
     
    
            nodemailer.createTestAccount((err, account) => {
                if (err) {
                    console.error('Failed to create a testing account. ' + err.message);
                    return process.exit(1);
                }
                console.log('Credentials obtained, sending message...');
                const transporter = nodemailer.createTransport({
                    host: 'smtp.ethereal.email',
                    port: 587,
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                });
                let message = {
                    from: 'Sender Name <sender@example.com>',
                    to: newUser.email,
                    subject: 'Email confirmation ✔',
                    text: 'please click the url!',
                    html: "please click the url <br>"+url
                };
            
                transporter.sendMail(message, (err, info) => {
                    if (err) {
                        console.log('Error occurred. ' + err.message);
                        return process.exit(1);
                    }
            
                    console.log('Message sent: %s', info.messageId);
                    //Preview only available when sending through an Ethereal account
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));


                    //EMAIL TESTI İÇİN GERİYE DÖNEN VERİYİ GOGGLE A YAZMAMIZ GEREKİYOR//
                    return res.status(200).json(nodemailer.getTestMessageUrl(info))
                });
            })
    
           // res.status(200).json(savedUser)
        } catch (error) {
            console.log(error);
            return res.status(500).json({error})      
     }         
}



// EMAIL CONFIRMATION
const emailConfirm = async (req,res,next)=>{
        const token = req.query.id;
        if (token) {
          try {
            jwt.verify(token,process.env.JWTSECRETKEY, async (e,decoded)=>{
                if (e) {
                    return res.status(400).json("Token is not valid")
                }else{
                   const tokenUserId = decoded.id
                   const result = await User.findByIdAndUpdate(tokenUserId,{
                        emailActive : true
                   });
                   if (result) {
                        return res.status(200).json({message:"Email confirmed"})
                   } else {
                    return res.status(401).json({ message:"There was an error confirming the email!!"})
                   }
                   
                }
            })
          } catch (error) {
            return res.status(400).json("Token is not valid")
          }
        } else {
            return res.status(400).json("Token is not valid")
    }
}



//LOGIN
const login = async(req,res,next)=>{
    const reqEmail = req.body.email;
    const reqPassword = req.body.password;
    try {
        const user = await User.findOne({ email: reqEmail });
        if (!user) {
            return res.status(401).json("Email or password is incorrect !!!");
        }
        if (user.emailActive) {
            try {
                const hashedpassword = await bcrypt.compare(reqPassword , user.password,(err,response)=>{
                    if(err) return res.status(401).json("Email or password is incorrect !!!");
                    if(!response) return res.status(401).json("Email or password is incorrect !!!");
                })
    
                const accessToken = await jwt.sign({
                    id: user._id,
                    isAdmin : user.isAdmin
                },process.env.JWTSECRETKEY,{expiresIn: "3d"})
    
                return res.status(200).json( { Token : accessToken } );
    
               } catch (error) {
                    return res.status(400).json(error);
               }
        }else{
            return res.status(400).json("please confirm your email first");
        }
           
       
    } catch (error) {
        return res.status(400).json(error);
    }
}



//LOGGED IN USER INFORMATION
const userInfo = async (req,res,next)=>{
    if (!req.params.id) {
        return res.status(400).json("Incorrect Url");
    }else{
        try {
            const findedUser = await User.findById(req.params.id);
            const findedUserObj ={
               username: findedUser.username,
               email: findedUser.email,
               createdAt: findedUser.createdAt
            }
            return res.status(200).json(findedUserObj);
        } catch (error) {
            return res.statust(401).json(error);
        }
    }
}



// LOGGED IN USER INFORMATION UPDATE 
const userUpdate = async(req,res,next)=>{

    if (!req.params.id) {
        return res.status(400).json("Incorrect Url");
    }else if(req.body.password) {
      const newpassword = await bcrypt.hash( req.body.password, 10, async (err,encrypted)=>{
        if (err) {
            return res.statust(401).json(err);
        }else{
            const UserUpdate = await User.findByIdAndUpdate(req.params.id,{
                username: req.body.username,
                password: encrypted
                
            }, {returnOriginal: false})
            const newUserInfo={
                username:UserUpdate.username,
                password: UserUpdate.password
            }
            return res.status(200).json(newUserInfo);
            
        }
      });

    }
    else{
        const UserUpdate = await User.findByIdAndUpdate(req.params.id,{
            username: req.body.username
        }, {returnOriginal: false})
        return res.status(200).json(UserUpdate.username);
    }
}



//ADMIN GET ALL USERS
const allUsers = async (req,res,next)=>{
    
    try {
        const allusers = await User.find().sort({ _id: -1})
        return res.status(200).json(allusers);
    } catch (error) {
        return res.status(500).json("Error :"+ error)
    }
    
}



const deleteUser = async(req,res,next)=>{
    
    if (!req.params.id) {
        return res.status(400).json("Incorrect Url");
    }else{
       try {
        const findanddelete =await User.findByIdAndDelete(req.params.id);
        console.log(findanddelete);
        return res.status(200).json(findanddelete);
       } catch (error) {
        return res.status(401).json(error);
       }

    }
}

module.exports = {
    registerUser,
    emailConfirm,
    login,
    userInfo,
    userUpdate,
    allUsers,
    deleteUser
};