const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req,res,next){
    const token = req.header('Authorization');

    if(!token) return res.status(401).json({status:false,message:'access denied!'})

    try {
        let _token = token.split(' ')[1];

        const decoded =  jwt.verify(_token,config.get('jwtPrivatekey'));

        req.user = decoded;
        next();
    } catch (ex) {
        console.log(ex)
        res.status(400).json({status:false,message:'invalid token'})
    }

    
}