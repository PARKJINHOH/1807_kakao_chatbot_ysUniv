var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '홈페이지는 준비중 입니다. [연성대 도우미 봇]' });
});

module.exports = router;
