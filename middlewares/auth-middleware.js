const jwt = require('jsonwebtoken');
const { where } = require('sequelize');
const { User } = require("../models");

module.exports = (req,res,next) =>{
    const {authorization} =req.headers;
    if(authorization){
    const [tokenType,tokenValue] = (authorization || "").split(" ");
    if(tokenType !=='Bearer'){
        res.status(401).send({
            errorMassage:'로그인이 필요합니다.'
        })
        return
    }

    try{
        const {userId} =jwt.verify(tokenValue,"secret-key")
        User.findByPk(userId)
        .then((user)=>{
        res.locals.user=user;
        next();
        });
    }
    catch(error){
        res.status(401).send({
            errorMassage:'로그인이 필요합니다.'
        })
        return
    }
}else{
    res.status(401).send({
        errorMassage:'로그인이 필요합니다.'
    })
    return
}

}