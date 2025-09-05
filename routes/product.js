const router =require('express').Router();

const { craeteProduct, deleteProduct, getProducts, updateProducts } = require('../controllers/product');
const {VerifyToken,verifyAdmin}=require('../middleware/authenticate');

router.post('/create',VerifyToken,verifyAdmin,craeteProduct)
router.delete('/:id',VerifyToken,verifyAdmin,deleteProduct)
router.patch('/:id',VerifyToken,verifyAdmin,updateProducts)

router.get('/get',VerifyToken,verifyAdmin,getProducts)

 module.exports=router;