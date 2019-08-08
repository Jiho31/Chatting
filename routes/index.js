var express = require('express');
var session = require('express-session');
var router = express.Router();
//var passport = require('passport');
//var KakaoStrategy = require('passport-kakao').Strategy;

var mysql = require('sync-mysql');
var dbinfo = require('../database.js');

var connectDB = new mysql(dbinfo.getDBInfo());

var id = "";
var userType = "";

router.use(session({
  secret: '1234DSFS@!',
  resave: false,
  saveUninitialized: true
}));

// localhost:3000/login/kakao로 들어오면(get으로 들어오면) passport.authenticate를 실행(여기서는 임의로 login-kakao로 이름을 줌)
// router.use(passport.initialize());

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });

// // var connection = mysql.createConnection({
// //   host: 'localhost',
// //   user: 'nodejs',
// //   password: 'seonhye6166',
// //   database: 'chatting'
// // });

// // connection.connect();

// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

// // 이름을 login-kakao로 임의로 주었습니다 그래서 /kakao로 들어오면 아래가 실행이 됩니다
// passport.use('login-kakao', new KakaoStrategy({
//   clientID: '093de487936421a33333e63ed00845b8',
//   callbackURL: 'http://randomchatting.cf:3000/oauth' // 카카오 개발자 사이트에서 지정한 리다이렉트 URL 
// },
//   function (accessToken, refreshToken, profile, done) {
//     console.log(profile);
//     return done(null, profile);
//   }
// ));


// router.get('/login', passport.authenticate('login-kakao'));

// router.get('/oauth', passport.authenticate('login-kakao', {
//   successRedirect: '/chattingList', // 성공하면 /main으로 가도록
//   failureRedirect: '/login'
// }));

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
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/c',function(req, res){
  res.render('c');
});

router.get('/Usignup', function (req, res) {
  res.render('Usignup');
});

router.post('/Usignup', function (req, res) {

  var id = req.body.Uid;
  var name = req.body.Uname;
  var pw = req.body.Upw;
  var phone = req.body.Unum;

  console.log(id, name, pw, phone);

  var checkId = `SELECT COUNT(*) FROM user WHERE id = '${id}';`
  var insertInfo = `INSERT INTO user(id, name, pw, phone) VALUES('${id}','${name}','${pw}','${phone}')`

  var Uid = connectDB.query(checkId)

  var length = Uid[0]['COUNT(*)'];
  console.log(length);

  if (length < 1) {
    var Uinfo = connectDB.query(insertInfo)
    console.log(Uinfo);
    res.send(`<script>alert('Sign up is completed! Please, login.'); document.location.href='/Ulogin';</script>`);
  }
  else {
    res.send('<script>alert("Your id is duplicated! Please change it."); document.location.href="/Usignup"</script>');
  }
});

router.get('/Msignup', function (req, res) {
  res.render('Msignup');
});

router.post('/Msignup', function (req, res) {

  var id = req.body.Mid;
  var name = req.body.Mname;
  var pw = req.body.Mpw;
  var phone = req.body.Mnum;

  console.log(id, name, pw, phone);

  var checkId = `SELECT COUNT(*) FROM manager WHERE id = '${id}';`
  var insertInfo = `INSERT INTO manager(id, name, pw, phone) VALUES('${id}','${name}','${pw}','${phone}')`

  var Uid = connectDB.query(checkId)

  var length = Uid[0]['COUNT(*)'];
  console.log(length);

  if (length < 1) {
    var Uinfo = connectDB.query(insertInfo)
    //console.log(Uinfo);
    res.send(`<script>alert('Sign up is completed! Please, login.'); document.location.href='/Mlogin';</script>`);
  }
  else {
    res.send('<script>alert("Your id is duplicated! Please change it."); document.location.href="/Msignup"</script>');
  }
});

router.get('/Ulogin', function (req, res) {
  res.render('Ulogin');
});

router.post('/Ulogin', function (req, res) {
  var id = req.body.Uid;
  var pw = req.body.Upw;

  console.log(id, pw);

  var checkId = `SELECT COUNT(*) FROM user WHERE id = '${id}' and pw = '${pw}';`;

  var Uid = connectDB.query(checkId)

  var length = Uid[0]['COUNT(*)'];

  if (length < 1) {
    res.send('<script>alert("Your information does not exist! Please sign up."); document.location.href="/Usignup"</script>')
  }
  else {
    if (!req.session.userId || !req.session.userType) {
      req.session.userId = id;
      req.session.userType = "user";
    }
    res.send('<script>document.location.href="/chattingList"</script>');
  }
});

router.get('/Mlogin', function (req, res) {
  res.render('Mlogin');
});

router.get('/Mlogin', function (req, res) {
  var id = req.body.Mid;
  var pw = req.body.Mpw;

  var checkId = `SELECT COUNT(*) FROM manager WHERE id = '${id}' and pw = '${pw}';`;

  var Uid = connectDB.query(checkId)

  var length = Uid[0]['COUNT(*)'];

  if (length < 1) {
    res.send('<script>alert("Your information does not exist! Please sign up."); document.location.href="/Msignup"</script>')
  }
  else {
    if (!req.session.userId || !req.session.userType) {
      req.session.userId = id;
      req.session.userType = "manager";
    }
    res.send('<script>document.location.href="/chattingList"</script>');
  }

})

router.post('/logout', function (req, res) {
  delete req.session.Uid;
  res.redirect('/login');
});

router.get('/chattingList', function (req, res) {
 
  if (!req.session.userId) {
    res.redirect('/Ulogin');
  }
  else {
    res.render('chattingList'); 

  }
});

router.post('/addroomInfo', function (req, res) {
  var roomType = req.body.type;
  var title = req.body.title;
  var category = req.body.category;
  
  console.log(roomType, title, category);
  
  var sql = `INSERT INTO room (roomType, roomName, category, participationNo) VALUES('${roomType}','${title}','${category}', 1)`;
  //var roomNo = req.body.roomNo;

  var id = connectDB.query(sql)['insertId'];
  
  res.send({roomId: id});
});

router.post('/getroomInfo',function(req, res){
  var step = req.body.step;
  var sql;
  step = step*6;
  sql = `SELECT room.roomType, room.roomName, room.category from room LIMIT 6 OFFSET ${step}`;

  
/*sql의 별점은 추가*/ 

  var result = connectDB.query(sql);
  res.send(result);
})

router.get('/qna', function (req, res) {

  resultQNA = connectDB.query("SELECT * FROM QNALIST");
  //console.log(resultQNA);
  res.render('qna_list', {
    qnaData: resultQNA
  });
});

router.get('/writepost', function (req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS QNALIST(postIndex INT NOT NULL AUTO_INCREMENT, userId CHAR(30), category TEXT, title TEXT, content TEXT, secretOrNot BOOLEAN, filePaths TEXT, date TEXT, PRIMARY KEY(postIndex)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

  res.render('writepost');
});

router.post('/new_qna1', function (req, res) {
  var qnaTitle = req.body.qnaTitle;
  var qnaCategory = req.body.qnaCategory;
  var qnaContent = req.body.qnaContent;
  //var qnaSecret=req.body.qnaSecret;
  var qnaSecret;

  //userId 로그인 기능 추가하고 나중에 테이블에 저장
  // secretOrNot 보류
  var addPost = "UPDATE QNALIST SET category='" + qnaCategory + "', title='" + qnaTitle + "', content='" + qnaContent + "' WHERE postIndex=" + resultPostNum + ";";
  connectDB.query(addPost);

  // console.log(qnaTitle);
  // console.log(qnaContent);
  // console.log(qnaCategory);
  //console.log(qnaSecret);

  res.redirect('/qna');
});

router.get('/mainMenu', function (req, res) {
  res.render('mainMenu', { title: 'Express' });
});


router.get('/qna', function (req, res) {
  res.render('qna_list');
});

router.get('/writepost', function (req, res) {
  res.render('writepost');
});

router.post('/new_qna', function (req, res) {
  var qnaTitle = req.body.qnaTitle;
  var qnaCategory = req.body.qnaCategory;
  var qnaContent = req.body.qnaContent;

  console.log(qnaTitle);
  console.log(qnaContent);
  console.log(qnaCategory);
});

router.get('/maketable', function (req, res) {
  var sql = [];

  sql[0] = `
    CREATE TABLE IF NOT EXISTS user(
      id VARCHAR(48) NOT NULL,
      pw TEXT,
      name VARCHAR(48),
      phone TEXT,
      grade INT, 
      report INT,
      list INT,
      PRIMARY KEY(id)
    )
  `
  sql[1] = `
    CREATE TABLE IF NOT EXISTS manager(
      id VARCHAR(48) NOT NULL,
      pw TEXT,
      name VARCHAR(48),
      phone TEXT,
      PRIMARY KEY(id)
    )
  `

  sql[2] = `
    CREATE TABLE IF NOT EXISTS room(
      roomNo INT NOT NULL AUTO_INCREMENT,
      category VARCHAR(10), 
      roomName VARCHAR(10),
      roomType INT,
      participationNo INT,
      PRIMARY KEY(roomNo)
    )
  `

  sql[3] = `
    CREATE TABLE IF NOT EXISTS roomInfo(
      roomNo INT,
      userId VARCHAR(48)
    )
  `

  connectDB.query(sql[0]);
  connectDB.query(sql[1]);
  connectDB.query(sql[2]);
  connectDB.query(sql[3]);

  res.redirect('/');
});

router.post('/new_qna2', upload.array('img', 5), function (req, res) {
  var postDate = new Date();
  var len = req.files.length; // 등록한 첨부 파일 갯수
  var filePaths;
  if (len > 0) {
    filePaths = req.files[0].path;
    for (i = 1; i < len; i++) {
      filePaths = filePaths + ', ' + req.files[i].path;
    }
  }

  // var addPost = "INSERT INTO QNALIST(filePaths, date)";
  var addPost = "INSERT INTO QNALIST(filePaths, date) VALUES('" + filePaths + "', '" + postDate + "')";
  connectDB.query(addPost);

  resultQNA = connectDB.query('SELECT COUNT(*) FROM QNALIST;')[0];
  var key1 = 'COUNT(*)';
  // console.log(resultQNA[key1]);
  resultPostNum = resultQNA[key1];

  res.send(true);
});

module.exports = router;