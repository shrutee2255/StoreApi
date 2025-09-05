const mongoose =require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide name']
    },
    desc:{
        type:String,
        required:[true,'please provide name'],
      
     unique:true,
    },
    img:{
        type:String,
        required:[true,'please provide Image'],
        
    },
    categories:[{
        type: Array,
        required:[true,'please provide Image'],
        
    }],
    price:{
        type: Number,
        required:true,
    },
    ratings:[{
        userId:{type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        },
        rating:{
            type: Number,
            min:1,
            max:5,
        }

}]
    
},{timestamps:true}
)

module.exports = mongoose.model('product',ProductSchema)