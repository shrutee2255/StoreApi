  const redis=require('redis')

  redisClient = redis.createClient();
    redisClient.connect().catch(console.err);
    redisClient.on('error' ,(err)=>{
        console.log('Redis error:', err);
    })

    module.exports=redisClient