        
const mongoose =require('mongoose')

const orderSchema = new mongoose.Schema({
 
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                default: 1
            },
           price: {
                type: Number,
                
            },
            name:{
                type:String,
            }
        }
    ],
    

    address:{
        type:Object,
        required:true
    },

    
  user:{
type: mongoose.Schema.Types.ObjectId,
ref:'user',
required:[true,'user is is required']
  },
 
  TotalAmount:{
    type:Number,
   
  },
  status:{
    type: String,

    default:"processing"
},

    
},{timestamps:true});
orderSchema.pre('save', async function(next) {
    if (!this.isModified('products'))
         return next();

    try {
        // Extract product IDs from the order
        const productIds = this.products.map(p => p.productId);

        // Fetch product details from the database
        const products = await mongoose.model('product').find({ _id: { $in: productIds } });

        // Create a map for efficient lookup {search in chatgpt to understand}
        const productMap = new Map(products.map(product => [product._id.toString(), product]));

        // Calculate totalAmount and populate product details
        let TotalAmount = 0;
        this.products.forEach(p => {
            const product = productMap.get(p.productId.toString());
            if (product) {
                p.name = product.name; // Optionally store product name
                p.price = product.price; // Optionally store product price
                TotalAmount += product.price * p.quantity;
            }
        });

        this.TotalAmount = TotalAmount; // Update the totalAmount field
        next();
    } catch (err) {
        next(err);
    }
});


   
module.exports = mongoose.model('order',orderSchema)