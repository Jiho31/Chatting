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
var mysql = require('sync-mysql');
var dbinfo = require('../database.js');
var multer = require('multer');
var path = require('path');
var upload = multer({
  //storage: multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     cb(null, 'uploads/');
  //   },
  //   filename: function (req, file, cb) {
  //     cb(null, new Date().valueOf() + path.extname(file.originalname));
  //   }
  // }),
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + file.originalname); // 타임스탬프 + 원래파일명으로 저장 (파일명이 중복되는 경우를 위해)
    }
  }),
  });

var connectDB = new mysql(dbinfo.getDBInfo());
var resultQNA = null; // q&a 글 내용 전역변수
var resultPostNum = null;

/* GET home page. */
router.get('/', function(req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS QNALIST(postIndex INT NOT NULL AUTO_INCREMENT, userId CHAR(30), category TEXT, title TEXT, content TEXT, secretOrNot BOOLEAN, filePaths TEXT, date DATETIME, PRIMARY KEY(postIndex)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

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

  resultQNA = connectDB.query('SELECT COUNT(*) FROM QNALIST;')[0];
  var key1 = 'COUNT(*)';
  resultPostNum = resultQNA[key1] / 2 + 1;

  res.render('qna_list', {
    pageNum: resultPostNum
  });
});

router.post('/qna_data', function(req, res){

  var pageNum = req.body.pageNo;
  pageNum = (pageNum-1)*2;
  resultQNA = connectDB.query("SELECT * FROM QNALIST ORDER BY date DESC LIMIT 2 OFFSET " + pageNum);

  res.send(resultQNA);
});

router.get('/writepost', function(req, res) {
  res.render('writepost');
});

router.post('/new_qna1', function(req, res){
  var qnaTitle = req.body.qnaTitle;
  var qnaCategory = req.body.qnaCategory;
  var qnaContent = req.body.qnaContent;
  var qnaSecret = req.body.qnaSecret;
  
  if (qnaSecret == undefined)
    qnaSecret = 'unchecked';
  //userId 로그인 기능 추가하고 나중에 테이블에 저장
  var addPost = "UPDATE QNALIST SET category='"+qnaCategory+"', title='"+qnaTitle+"', content='"+qnaContent+"', secretOrNot='"+qnaSecret+"' WHERE postIndex="+resultPostNum+";";
  connectDB.query(addPost);

  // console.log(qnaTitle);
  // console.log(qnaContent);
  // console.log(qnaCategory);
  // console.log(qnaSecret);

  res.redirect('/qna');
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

router.post('/new_qna2', upload.array('img', 5), function(req, res){
  require('date-utils');
  var postDate = new Date();
  postDate = postDate.toFormat('YYYY-MM-DD HH24:MI:SS');
  // console.log(postDate);
  var len = req.files.length; // 등록한 첨부 파일 갯수
  var filePaths;
  if(len>0){
    filePaths = req.files[0].path; 
    for(i=1; i<len; i++){
      filePaths=filePaths+', '+req.files[i].path;
    }
  }
  
  // var addPost = "INSERT INTO QNALIST(filePaths, date)";
  var addPost = "INSERT INTO QNALIST(filePaths, date) VALUES('"+ filePaths+"', '"+postDate+"')";
  connectDB.query(addPost);
  
  resultQNA = connectDB.query('SELECT COUNT(*) FROM QNALIST;')[0];
  var key1 = 'COUNT(*)';
  // console.log(resultQNA[key1]);
  resultPostNum = resultQNA[key1];
    
  res.send(true);
})
router.get('/showpost', function(req, res){
  res.render('showpost');
});
module.exports = router;

//지호
//문성희
//이선혜
