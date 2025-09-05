const mongoose =require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name']
    },
    email:{
        type:String,
        required:[true,'please provide name'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
     ,'please provide valid email'],
     unique:true,
    },
    password:{
        type:String,
        required:[true,'please provide email'],
        minlength:6,
    },
    isAdmin:{
        type: Boolean, default: false 
    }
})

userSchema.pre('save',async function(){
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
   

})



userSchema.methods.createJWT = function(){
    return jwt.sign({userID:this._id,name: this.name,isAdmin:this.isAdmin}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_LIFETIME
    })   

}



module.exports = mongoose.model('user',userSchema)