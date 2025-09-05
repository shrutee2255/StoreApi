const Order = require('../models/order');
const {  BadRequestError,NotFoundError}= require('../errors')
const {StatusCodes}= require('http-status-codes');
const Product = require('../models/product');
const order = require('../models/order');
 

const createorder = async (req,res)=>{
  const {products,address}=req.body;

  const order =await Order.create({
    user:req.user.userID,products, address,
  })
res.status(StatusCodes.OK).json({order})
}

module.exports={createorder}

