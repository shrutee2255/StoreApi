const router =require('express').Router();
const { updateUser,getUser } = require('../controllers/user');
const {VerifyToken}=require('../middleware/authenticate');

router.get('/get',VerifyToken,getUser)
router.patch('/update',VerifyToken,updateUser)

 module.exports=router;