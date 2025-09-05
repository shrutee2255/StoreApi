        
        
const mongoose =require('mongoose')

const cartSchema = new mongoose.Schema({
    UserId:{
        type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    products:[
        { productID:{
            type: mongoose.Schema.ObjectId,
            ref: 'product',
            required: true,
        },
        quantity:{
            type:Number,
            default:1,
        },
    }

       
        
    ],
        
    
});

module.exports = mongoose.model('cart',cartSchema)