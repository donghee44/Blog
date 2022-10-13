const express = require('express');
const router = express.Router();
const jwt=require("jsonwebtoken")
const authMiddleware =require("../middlewares/auth-middleware.js")
const loginMiddleware =require("../middlewares/login-middleware.js")
const { Op } = require("sequelize");
const { User } = require("../models");
const Joi = require("joi")


//회원가입
router.post("/signup",loginMiddleware,async(req,res)=>{
    const schema = Joi.object({
        nickname:Joi.string().alphanum().min(3).required(),
        password:Joi.string().alphanum().min(4).required(),
        confirmPassword:Joi.ref('password')
    })

    try{
        const {nickname,password,confirmPassword}=schema.validateAsync(req.body)
        
    if(password !==confirmPassword){
        res.status(400).send({
            errorMessage:'패스워드가 패스워드 확인란과 동일하지 않습니다.'
        })
        return;
    }

    const exisUsers = await User.findAll({
        where: {
        nickname:nickname}
    })
    if(exisUsers.length){
        res.status(400).send({
            errorMessage:'중복된 닉네임 입니다.'
        })
        return
    }

    await User.create({ nickname, password });
    res.status(201).send("회원가입완료")
    }
    catch(err){
        console.log("위")
        return res.status(400).send({
            errorMessage:"닉네임 또는 패스워드를 다시 확인해주세요"
        })
        console.log("아래")
    }
})


//로그인
router.post("/auth",loginMiddleware,async(req,res)=>{
    const {nickname,password}=req.body;
    const user =await User.findOne({where: {
        nickname,
},
});


    if(!user){
        res.status(400).send({
            errorMessage: "닉네임 또는 패스워드를 확인해주세요."
    });
        return;
    }
    const token = jwt.sign({ userId: user.userId }, "secret-key");
    res.send({
        token,
    })
})

router.get("/users/me",authMiddleware,async(req,res)=>{
    const {user} =res.locals;
    res.send({
        user:{
            nickname:user.nickname,
        },
    })
});

module.exports = router;