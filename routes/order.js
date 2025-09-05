const router =require('express').Router();
const { createorder } = require('../controllers/order');
const {VerifyToken,verifyAdmin}=require('../middleware/authenticate');
  

router.post('/create',VerifyToken,createorder)
 module.exports=router;