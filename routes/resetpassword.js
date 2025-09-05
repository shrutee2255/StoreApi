const router = require('express').Router()
const bodyParser = require('body-parser');
const crypto = require('crypto');
const sendEmail = require('../controllers/mailer')
const { NotFoundError, BadRequestError } = require('../errors')
const { VerifyToken } = require('../middleware/authenticate')
const Otp = require('../models/otp')
const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const bcrypt = require('bcryptjs')





// Helper function to generate OTP
const generateOTP = () => {
    return crypto.randomInt(100000, 999999).toString();
};

router.post('/request-password-reset',VerifyToken,async(req,res)=>{
const {email} = req.body

if(!email){
    throw new NotFoundError('email not found');
}

const user =  await User.findOne({email})

if(!user){
    throw new NotFoundError('user not found');

}

const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await Otp.findOneAndUpdate(
        {email},{otp,expiresAt},{ upsert: true }
    )

    const subject = 'Password Reset OTP';
    const text = `Your OTP code for password reset is ${otp}. It is valid for 15 minutes.`;
    try {

       await sendEmail({email, subject, text});
        res.status(200).json({msg:'OTP sent successfully'});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({msg:'Error sending OTP' });
    }

});

router.post('/change-password',VerifyToken,async(req,res)=>{
    const{email,otp,newpassword}=req.body

    if(!email||!otp||!newpassword){
        throw new BadRequestError("Feild missing")
    }

   

   const otp2 = await Otp.findOne({email})

   if(!otp2){
    throw new BadRequestError("not found")
   }

   if(otp2.otp!== otp){
    throw new BadRequestError("otp is invalid")
   }

   if (otp2.expiresAt < Date.now()){
    throw new BadRequestError("otp is expired")

   }
    // const hashedPassword = await bcrypt.hash(newpassword, 10);

   const user =  await User.findOne({email})
   if(!user){
       throw new NotFoundError("user not found")
   }
   user.password = newPassword
   user.save();

   await Otp.deleteOne({ email });
res.status(StatusCodes.OK).json({msg:"password changed sucessfully"})

})

module.exports =router
