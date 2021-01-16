var dotenv =require('dotenv');
dotenv.config()

 var config ={}; 

 config.JWT_SECRETE="" + process.env.JWT_SECRETE,
config.EMAIL_ADDRESS=""+process.env.EMAIL_ADDRESS,
config.EMAIL_PASSWORD=""+process.env.EMAIL_PASSWORD  
   
    
 module.exports=config;