var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/chattingList', function(req, res) {
  res.render('chattingList');
});

module.exports = router;

//지호
//문성희
//이선혜
