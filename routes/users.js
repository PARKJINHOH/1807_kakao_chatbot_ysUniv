var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('방문해주셔서 감사합니다.');
});

module.exports = router;
