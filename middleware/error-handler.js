const { Object } = require('joi')
const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {
let customError={
  statusCode :err.statuscode || StatusCodes.INTERNAL_SERVER_ERROR,
  msg:err.message ||  'something went wrong try agagin later'
}


  // if (err instanceof CustomAPIError) {
  //   return res.status(err.statusCode).json({ msg: err.message })
  // }
  if(err.name==='ValidationError'){
    customError.msg = Object.values(err.errors).map((item)=>item.message).join(',')
    customError.statusCode= 400
  }

  if(err.code && err.code === 11000){
    customError.msg=`duplicate value entered for ${Object.keys(err.keyValue)} feild ,please choode another value`
    customError.statusCode=400
  }

  if(err.name === 'CastError'){
    customError.msg=`No item found with id: ${err.value}`
    customError.statusCode= 400
  }
  // ${Object.keys(err.keyValue)} this tells which feild has error like email feild
  return res.status(customError.statusCode).json({ msg:customError.msg })
}

module.exports = errorHandlerMiddleware


// const object1 = {
//   a: 'somestring',
//   b: 42,
//   c: false,
// };

// console.log(Object.keys(object1));
// // Expected output: Array ["a", "b", "c"]

// const array1 = [1, 4, 9, 16];

// // Pass a function to map
// const map1 = array1.map((x) => x * 2);

// console.log(map1);
// // Expected output: Array [2, 8, 18, 32]
