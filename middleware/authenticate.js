const jwt= require('jsonwebtoken');
const user =require('../models/user');
const { UnauthenticatedError } = require('../errors')


const VerifyToken = (req,res,next)=>{

    const  authHeader =  req.headers.authorization

    if(!authHeader|| !authHeader.startsWith('Bearer')){
        throw new UnauthenticatedError("Authentication Inavlid");
    }
const token= authHeader.split(' ')[1]

const payload=jwt.verify(token,process.env.JWT_SECRET)

    //attach users to request object
    req.user ={userID:payload.userID,name:payload.name,isAdmin:payload.isAdmin};
   
    next()
}
const verifyAdmin = (req,res,next)=>{
  VerifyToken(req,res,()=>{
   
    if (!req.user.isAdmin) {
        throw new UnauthenticatedError("Not allowed to do so")
    }
    next()
  })

   
}


module.exports= {VerifyToken,verifyAdmin}