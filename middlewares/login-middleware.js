const jwt = require('jsonwebtoken')
const { User } = require("../models");

module.exports = (req,res,next) =>{
    const {authorization} =req.headers;
    if(authorization){
    const [tokenType,tokenValue] = (authorization || "").split(" ");
    if(tokenType ==='Bearer'){
        res.status(400).send({
            errorMassage:'이미 로그인이 되어 있습니다.'
        })
        return
    }
    }else{
    next()
    }

}