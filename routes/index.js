const express = require("express");
const router = express.Router();
const postsRouter = require("./posts.js");//posts의 router 불러오기
const commentsRouter = require("./comments.js")
const loginRouter=require("./login.js")

router.use("/posts",postsRouter);
router.use("/comments",commentsRouter);
router.use("/",loginRouter);

module.exports = router;