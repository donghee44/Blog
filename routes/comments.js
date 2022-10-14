const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware.js');
const { commenting } = require('../models');

//전체 댓글 조회
router.get('/', async (req, res) => {
  const Comments = await commenting.findAll();
  const [commentdate] = Comments.sort(function (a, b) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }).reverse();
  res.json({
    Comments,
  });
});

//상세 댓글 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const detail = await commenting.findAll({ where: { postId: postId } });
  res.json({ detail });
});

//댓글 추가
router.post('/:postId', authMiddleware, async (req, res) => {
  const { user } = res.locals;
  const { postId } = req.params;
  const { comments } = req.body;
  const nickname = user.nickname;
  if (comments === ' ') {
    res.send('댓글 내용을 입력해 주세요');
  } else {
    const comment = await commenting.create({ postId, nickname, comments });
    res.send('입력완료!');
  }
});

//댓글 수정
router.patch('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { comments } = req.body;
  const { user } = res.locals;
  const nickname = user.nickname;
  const detail = await commenting.findOne({ where: { commentId: commentId } });
  const name = detail.nickname;
  if (comments === ' ') {
    res.send('댓글 내용을 입력해 주세요');
  } else if (nickname === name) {
    await commenting.update(
      { comments: comments },
      { where: { commentId: commentId } },
    );
    res.send('댓글을 수정하였습니다.');
  } else {
    res.status(400).send({
      errorMessage: '권한이 없습니다.',
    });
  }
});

//댓글 삭제
router.delete('/:commentId', authMiddleware, async (req, res) => {
  const { commentId } = req.params;
  const { user } = res.locals;
  const nickname = user.nickname;
  const detail = await commenting.findOne({ where: { commentId: commentId } });
  const name = detail.nickname;
  if (nickname === name) {
    await commenting.destroy({ where: { commentId: commentId } });
    res.send({
      message: '데이터를 삭제했습니다.',
      data: commenting,
    });
  } else {
    res.status(400).send({
      errorMessage: '권한이 없습니다.',
    });
  }
});

module.exports = router;
