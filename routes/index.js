var express = require('express');
var session = require('express-session');
// var mysql = require('sync-mysql');
var router = express.Router();
var passport = require('passport');
var KakaoStrategy = require('passport-kakao').Strategy;

// localhost:3000/login/kakao로 들어오면(get으로 들어오면) passport.authenticate를 실행(여기서는 임의로 login-kakao로 이름을 줌)
router.use(passport.initialize());

passport.serializeUser(function(user, done) {
  done(null, user);
});

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'nodejs',
//   password: 'seonhye6166',
//   database: 'chatting'
// });

// connection.connect();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/*데이터베이스 테이블 생성*/
router.get('/maketable', function(req, res) {
  
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

router.get('/login', passport.authenticate('login-kakao'));

router.get('/oauth', passport.authenticate('login-kakao', {
    successRedirect: '/chattingList', // 성공하면 /main으로 가도록
    failureRedirect: '/'
}));

router.get('/maketable',function(req, res){
  var sql = [];
  
  sql[0] = `
    CREATE TABLE IF NOT EXISTS userInfo{
      id VARCHAR(10),
      grade INT, 
      report INT,
      list INT
    }
  `
  
  sql[1] = `
    CREATE TABLE IF NOT EXISTS roomInfo{
      roomNo INT NOT NULL,
      category VARCHAR(10), 
      roomName VARCHAR(10),
      mode INT,
      participation INT
    }
  `

});

module.exports = router;

//지호
//문성희
//이선혜
