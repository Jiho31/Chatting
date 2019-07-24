var express = require('express');
var router = express.Router();
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
  connectDB.query("CREATE TABLE IF NOT EXISTS QNALIST(`index` INT NOT NULL AUTO_INCREMENT, userId CHAR(30), category TEXT, title TEXT, content TEXT, secretOrNot BOOLEAN, filePaths TEXT, date TEXT, PRIMARY KEY(`index`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

  res.render('writepost');
});

router.post('/new_qna1', function(req, res){
  var qnaTitle=req.body.qnaTitle;
  var qnaCategory=req.body.qnaCategory;
  var qnaContent=req.body.qnaContent;
  //var qnaSecret=req.body.qnaSecret;
  var qnaSecret;
  var num=1;

  //userId 로그인 기능 추가하고 나중에 테이블에 저장
  // secretOrNot 보류
  var addPost = "UPDATE QNALIST SET category='"+qnaCategory+"', title='"+qnaTitle+"', content='"+qnaContent+"' WHERE QNALIST.index="+num+";";
  connectDB.query(addPost);

  // console.log(qnaTitle);
  // console.log(qnaContent);
  // console.log(qnaCategory);
  //console.log(qnaSecret);

  res.redirect('/qna');
});

router.post('/new_qna2', upload.array('img', 5), function(req, res){
  var postDate = new Date();
  var len = req.files.length; // 등록한 첨부 파일 갯수
  var filePaths;
  if(len>0){
    filePaths = req.files[0].path; 
    for(i=1; i<len; i++){
      filePaths=filePaths+', '+req.files[i].path;
    }
  }
  
  var addPost = "INSERT INTO QNALIST(filePaths, date)";
  addPost = addPost + "VALUES('"+ filePaths+"', '"+postDate+"');";
  connectDB.query(addPost);
  
  res.send(true);
})
module.exports = router;

//지호
//문성희
//이선혜
