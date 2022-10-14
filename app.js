const express = require('express');

//body 객체 오류 해결
const bodyParser = require('body-parser');

const app = express();
const router = require('./routes/index.js');

//body 객체 오류 해결
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use('/api', router);

app.listen(8080, () => {
  console.log('서버가 요청을 받을 준비가 됐어요');
});
