const Joi = require('joi');


const verifyRegister = async (req,res,next)=>{
    const schema = Joi.object({
        username: Joi.string()
            .alphanum()
            .min(4)
            .max(30)
            .required(),
    
    
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),


        password: Joi.string()
            .min(5)
            .required(),       
    })
    
    try {
        const value = await schema.validateAsync({ username: req.body.username , email:req.body.email , password :req.body.password});
        if (value) {
            next();
        }
    }
    catch (err) {
        res.status(401).json("Fill in the fields according to the desired rules :" +err)
     }
}


const verifyLogin = async (req,res,next)=>{
    const schema = Joi.object({
       
        email: Joi.string()
            .email({ minDomainSegments: 2 })
            .required(),


        password: Joi.string()
            .min(5)
            .required(),       
    })
    
    try {
        const value = await schema.validateAsync({ email:req.body.email , password :req.body.password});
        if (value) {
            next();
        }
    }
    catch (err) {
        res.status(401).json("Fill in the fields according to the desired rules :"+err)
     }
}


const verifyUpdate = async (req,res,next)=>{
    const schema = Joi.object({
       
        username: Joi.string()
            .alphanum()
            .min(4)
            .max(30),


        password: Joi.string()
            .min(5)    
    })
    
    try {
        const value = await schema.validateAsync({ username:req.body.username , password :req.body.password});
        if (value) {
            next();
        }
    }
    catch (err) {
        res.status(401).json("Fill in the fields according to the desired rules :"+err)
     }
}





module.exports = {
    verifyRegister,
    verifyLogin,
    verifyUpdate
}