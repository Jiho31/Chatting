var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/chattingList', function(req, res) {
  res.render('chattingList');
});

router.get('/mainMenu', function(req, res) {
  res.render('mainMenu', { title: 'Express' });
});

router.get('/roomModal', function(req, res) {
  res.render('roomModal', { title: 'Express' });
});
router.get('/qna', function(req, res) {
  res.render('qna_list');
});

router.get('/writepost', function(req, res) {
  res.render('writepost');
});

router.post('/new_qna', function(req, res){
  var qnaTitle=req.body.qnaTitle;
  var qnaCategory=req.body.qnaCategory;
  var qnaContent=req.body.qnaContent;

  console.log(qnaTitle);
  console.log(qnaContent);
  console.log(qnaCategory);
});
module.exports = router;

//지호
//문성희
//이선혜
