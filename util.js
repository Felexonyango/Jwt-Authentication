var jwt = require('jsonwebtoken')
const config = require('./config')
require('dotenv').config()
const getToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email

        },
        config.JWT_SECRETE,
        {
            expiresIn: '72000'
        }
        
    );
}
const isAuth = (req, res, next) => {

    const token = req.headers['x-access-token']
    
  if(!token){
      return res.status(403).send({message:"No token provided!"})

  }
  else{
  jwt.verify(token,config.JWT_SECRETE,(err,decoded)=>{
      if(err){

        return res.status(401).send({message:"unauthorized!"})

      }
      req.userId =decoded._id;
  })
    
  }     
        
}

module.exports = { getToken, isAuth } 