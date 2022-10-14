const express = require('express');
const authMiddleware = require('../middlewares/auth-middleware.js');
const router = express.Router();
const { posting } = require('../models');
const { Like } = require('../models');

//전체 게시글 조회
router.get('/', async (req, res) => {
  const Posts = await posting.findAll();
  res.json({
    Posts,
  });
});

//좋아요 목록 확인
router.get('/like', authMiddleware, async (req, res) => {
  const { user } = res.locals;
  const nickname = user.nickname;
  const detail = await Like.findAll({ where: { nickname: nickname } });
  const postId = detail.postId;
  const likeList = await posting.findAll(
    { model: Like },
    { where: { postId: postId } },
  );
  const [liktSort] = likeList
    .sort(function (a, b) {
      return a.like - b.like;
    })
    .reverse();

  return res.json({ likeList });
});

//상세 게시글 조회
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const detail = await posting.findOne({ where: { postId: postId } });
  res.json({ detail });
});

//게시글 추가
router.post('/', authMiddleware, async (req, res) => {
  const { user } = res.locals;
  const { title, contents } = req.body;
  const nickname = user.nickname;
  const like = 0;
  const posts = await posting.create({ nickname, title, contents, like });
  return res.send('게시글을 생성하였습니다.');
});

//게시글 수정
router.patch('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { title, contents } = req.body;
  const detail = await posting.findOne({ where: { postId: postId } });
  if (title === ' ' || contents === ' ') {
    res.send('내용을 입력해 주세요.');
  } else {
    await posting.update(
      { title: title, contents: contents },
      {
        where: { postId: postId },
      },
    );
    res.send({
      message: '데이터를 수정했습니다.',
      data: posting,
    });
  }
});

//게시글 삭제
router.delete('/:postId', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  await posting.destroy({ where: { postId: postId } });
  res.send({
    message: '데이터를 삭제했습니다.',
    data: posting,
  });
});

//좋아요
router.patch('/:postId/like', authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const detail = await posting.findOne({ where: { postId: postId } });
  const { user } = res.locals;
  const nickname = user.nickname;
  const likeDetail = await Like.findOne({ where: { nickname: nickname } });
  if (likeDetail) {
    const name = likeDetail.nickname;
    const likepost = likeDetail.postId;
    if (nickname === name && likepost === postId) {
      await posting.increment(
        {
          like: -1,
        },
        {
          where: { postId: postId },
        },
      );
      await Like.destroy({ where: { postId: postId } });
      res.send({
        message: '게시글의 좋아요를 취소했습니다.',
        data: posting,
      });
    } else {
      await posting.increment(
        {
          like: 1,
        },
        {
          where: { postId: postId },
        },
      );
      await Like.create({
        like: 1,
        postId: postId,
        nickname: nickname,
      });
      res.send({
        message: '게시글의 좋아요를 등록했습니다.',
        data: posting,
      });
    }
  } else {
    await posting.increment(
      {
        like: 1,
      },
      {
        where: { postId: postId },
      },
    );
    await Like.create({
      like: 1,
      postId: postId,
      nickname: nickname,
    });
    res.send({
      message: '게시글의 좋아요를 등록했습니다.',
      data: posting,
    });
  }
});

module.exports = router;
