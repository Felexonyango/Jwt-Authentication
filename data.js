var dotenv =require('dotenv');
dotenv.config()

 var config ={}; 

 config.DB=""+process.env.DB
    
 
    
 module.exports=config;