const express = require('express');
const app = express();
const mongoose =require('mongoose')
const https =require('https')
const fs= require('fs');
const session = require('express-session');
const dotenv =require("dotenv").config();
const router = require('./routes/auth');
const userrouter = require('./routes/user');
const productrouter =require('./routes/product')
const orderrouter = require('./routes/order')
const resetrouter =require('./routes/resetpassword')
const redisClient =require('./controllers/redis.js')

const errorHandlerMiddleware =require('./middleware/error-handler')
const notFoundMiddleware =require('./middleware/not-found');
app.use(express.json());

const tlssessioncache= new Map(); //🧠 This is a basic session cache. In production, you might use Redis or another cache if you want persistence or load balancing.

mongoose.connect(process.env.MONGO_URL
    ).then(()=>console.log("db connection successful")).catch((err)=>{
        console.log(err);
    });

  app.use(session({
  store: redisClient ,
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,  // set to true in production with HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

 app.get('/', (req, res) => {
    console.log('test is successful');
    res.send('Hello from HTTPS server');  // ✅ respond to client
});

  //Route
app.use('/api/user',router);
app.use('/api/user',resetrouter);

app.use('/api/user',userrouter);
app.use('/api/product',productrouter);
app.use('/api/order',orderrouter);

app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);




// console.log('key.pem exists:', fs.existsSync('./certs/key.pem'));
// console.log('cert.pem exists:', fs.existsSync('./certs/cert.pem'));


const option={
    key:fs.readFileSync('./certs/key.pem'),
    cert:fs.readFileSync('./certs/cert.pem'),

resumesession(sessionid,callback){
    const session=tlssessioncache.get(sessionid.toString('hex'));
    callback(null, session);  // ✅ Proper session resumption

}

}
const server=https.createServer(option,app);



server.on('newSession',(sessionid,sessiondata,callback)=>{
    try{
    tlssessioncache.set(sessionid.toString('hex'),sessiondata);
    // console.log(sessionid)
    callback(null,null);//it tells tls that work is done it can also be used to handle error like callback(error)
}catch(err){
callback(error) // pass error to TLS engin
}
})

 const port=process.env.PORT || 6000
server.listen(port,()=>{
    console.log(`server is listening on ${port}`)
})