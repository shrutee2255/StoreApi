
const User =require('../models/user');
const {  BadRequestError,NotFoundError}= require('../errors')
const {StatusCodes}= require('http-status-codes')

const getUser = async (req,res)=>{
     const {userID} =req.user;

     const user = await User.findById(userID)

        if(!user){
            throw new NotFoundError(`no user with ${userID} `);
        }
     res.status(StatusCodes.OK).json({user});
}


const updateUser= async (req,res)=>{
  
    const { userID } = req.user; // Get the userID from the req.user object
    const updates = req.body;
    const user =await User.findByIdAndUpdate(userID,updates, { new: true, runValidators: true })
    if(!user){
        throw new NotFoundError("no user with that id");
    }
  

    res.status(StatusCodes.OK).json({user})

}
module.exports= {updateUser,getUser}