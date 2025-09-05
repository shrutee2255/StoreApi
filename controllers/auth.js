const User =require('../models/user');
const redisClient =require('./redis.js')
const {StatusCodes} = require('http-status-codes');
const {  BadRequestError,UnauthenticatedError}= require('../errors');
const { emitWarning } = require('process');
const { string } = require('joi');



const register = async(req,res)=>{
    const user =  await User.create({...req.body})

    const token = user.createJWT();
   const userObj= user.toObject?user.toObject():user
   console.log(userObj)

    // Convert all values to string for Redis
    const redisUser = {};
    // for (const [key, value] of Object.entries(userObj)) {
    //     redisUser[key] = String(value);
    // }
    Object.entries(userObj).forEach((key,value)=> 
         redisUser[key] = String(value)
  
       

    )
    console.log(redisUser)
    await redisClient.hSet(`userkey${user.email}`,redisUser)//user.toObject() is needed if user is a Mongoose document — it converts it to a plain JS object
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login = async(req,res)=>{
 const {email,password}=req.body;

 if(!email||!password){
    throw new BadRequestError('please provide email and password')
 }
const cachedUser=await redisClient.hGetAll(`userkey${email}`)
if(Object.keys(cachedUser).length > 0){
     
     
     console.log('from redis')
}

//if not in redis than
 const user =await  User.findOne({email})

 if(!user){
    throw new UnauthenticatedError('invalid credentials')
 }

 const token = user.createJWT();

 res.status(StatusCodes.OK).json({user,token})
}

module.exports ={
    register,login
}