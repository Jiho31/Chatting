var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/mainMenu', function(req, res) {
  res.render('mainMenu', { title: 'Express' });
});


router.get('/writepost', function(req, res) {
  res.render('writepost');
});
module.exports = router;

//지호
//문성희
//이선혜
