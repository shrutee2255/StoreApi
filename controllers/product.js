const Product = require('../models/product');
const {  BadRequestError,NotFoundError}= require('../errors')
const {StatusCodes}= require('http-status-codes')


const craeteProduct = async (req,res)=>{
const product = await Product.create({...req.body})
res.status(StatusCodes.OK).json({product});
}


const deleteProduct = async(req,res)=>{
const product = await Product.findByIdAndDelete(req.params.id)
if(!product){
    throw new NotFoundError('product not found')
}
res.status(StatusCodes.OK).json({msg:'product deleted suceesfully'})
}


const getProducts = async (req,res)=>{
const category = req.query.categories;
let product
if(category){
     product = await Product.find({
        categories:{
            $in :[category],
        }
    })

}
else{
   product = await Product.find()

}


if(!product){
     throw new NotFoundError("no product")
}
res.status(StatusCodes.OK).json({product})

}

const updateProducts = async (req,res)=>{
const productID= req.params.id
const updates= req.body;

const product = await Product.findByIdAndUpdate(productID,updates, { new: true, runValidators: true })

if(!product){
    throw new NotFoundError(`no product with id: ${productID}`)
}

res.status(StatusCodes.OK).json({msg:'product updated suceesfully',product});
}
module.exports ={craeteProduct,deleteProduct,getProducts,updateProducts}