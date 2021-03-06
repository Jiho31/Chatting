var express = require('express');
var session = require('express-session');
var router = express.Router();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
//var passport = require('passport');
//var KakaoStrategy = require('passport-kakao').Strategy;
var bkfd2Password = require("pbkdf2-password");
var hasher = bkfd2Password();

var mysql = require('sync-mysql');
var dbinfo = require('../database.js');

var connectDB = new mysql(dbinfo.getDBInfo());

var id = "";
var userType = "";
var socket_io = require('socket.io');
var io = socket_io();
router.io = io;

router.use(session({
  secret: '1234DSFS@!',
  resave: false,
  saveUninitialized: true
}));

router.post('/getCurrentUserId', function (req, res) {
  var id = 'testIds';
  if (req.session.userId) id = req.session.userId;
  res.send(id);
});

router.post('/getChatHistory', function (req, res) {
  var roomId = req.body.roomId;
  var uid = !req.session.userId ? "testIds" : req.session.userId;
  var lastIdx = connectDB.query(`SELECT lastIdx FROM roomParticipants WHERE roomNo=${roomId} AND userId='${uid}'`)[0]['lastIdx'];

  var sql = `SELECT * from chatdata WHERE chatroomID=${roomId}`;

  console.log(lastIdx, req.session.userId);
  var result = connectDB.query(sql);
  result.splice(0, lastIdx);
  res.send(result);
});

router.io.on('disconnect', socket => {
  console.log("router io disconnected");
});

//socket 통신 소스
router.io.on('connection', socket => {

  socket.emit('connection', {
    type: 'connected'
  });

  // 사용자가 대화방에 접속할 때(방을 만든 후에도 포함)
  socket.on('connection', data => {
    if (data.type === 'join') {
      socket.join(data.room);

      // depracated
      // socket.set('room', data.room);
      socket.room = data.room;

      const checkConnectUser = function() {
        // 참여중인 사용자 목록이 중복되는지 확인
        var check = connectDB.query(`SELECT COUNT(*) FROM roomParticipants WHERE roomNo=${socket.room} AND userId='${data.name}'`)[0]['COUNT(*)'];
      
        // 사용자 수 가져오기
        var userNum = connectDB.query(`SELECT COUNT(*) FROM roomParticipants WHERE roomNo=${socket.room} AND isPart='1'`)[0]['COUNT(*)'];
      
        // 방 타입 가져오기
        var roomType = connectDB.query(`SELECT roomType FROM room WHERE roomNo=${socket.room}`)[0]['roomType'];
      
        // 기본적으로 중복되지 않으면 참여자 정보 저장
        if(check == 0) {
          if(roomType == 0) {
            // 1대1이고 사용자가 2명까지는 참여자 정보 저장
            if(userNum < 2) {
              return 1;
            }
            // 2명 넘어가면 저장하지 않고 에러 반환
            else {
              return 0;
            }
          }
          // 게시판일 경우 중복된 사용자가 없으면 무조건 저장
          else {
            return 1;
          }
        }
      }

      // 접속 가능한지 체크
      if(checkConnectUser() === 1) {

        // 이전 대화 수 불러오기
        var lastIdx = connectDB.query(`SELECT COUNT(*) FROM chatdata WHERE chatroomID=${socket.room}`)[0]['COUNT(*)'];

        // 사용자 정보 저장
        connectDB.query(`INSERT INTO roomParticipants(roomNo, userId, isPart) VALUES (${socket.room}, '${data.name}', 1)`);

        // 참여 정보에 해당 사용자의 대화 인덱스를 업데이트
        connectDB.query(`UPDATE roomParticipants SET lastIdx=${lastIdx} WHERE userId='${data.name}'`);

        // 대화방 추가와 동시에 접속중인 상태로 되므로 온라인 상태
        connectDB.query(`UPDATE roomParticipants SET isOnline=1 WHERE roomNo=${socket.room} AND userId='${data.name}'`);
      }
      else {
        console.log("들어갈 수 없습니다!"); 
      }
    }

    // 사용자가 접속을 일시로 끊은(자리를 비우는 등) 상태 
    socket.on('disconnect', function () {
      socket.broadcast.to(data.room).emit('system', {
        message: `${data.name} 님이 오프라인 상태입니다.`
      });

      try {
        console.log('[socket]', 'leave room :', data);
        socket.leave(data);
        socket.to(data).emit('user left', socket.id);

        // 해당 사용자를 오프라인 상태로 변경
        var updateSQL = `UPDATE roomParticipants SET isOnline=0 WHERE roomNo=${socket.room} AND userId='${data.name}'`;
        connectDB.query(updateSQL);
      } catch (e) {
        console.log('[error]', 'leave room :', e);
        socket.emit('error', 'couldnt perform requested action');
      }
    });

    socket.emit('system', {
      message: 'welcome to chat room!'
    });

    socket.broadcast.to(data.room).emit('system', {
      message: `${data.name} is connected`
    });
  });

  socket.on('user', data => {

    // depracated
    // socket.get('room', (error, room) => {
    // });

    var room = socket.room;
    console.log(data);

    var chatsql = `INSERT INTO chatdata(userID, chatroomID, chatcontent) VALUES('${data.name}', ${data.roomId}, '${data.message}')`;
    var chatidx = connectDB.query(chatsql).insertId;

    console.log(chatidx);

    if (room) {
      socket.broadcast.to(room).emit('message', data);
    }
  });

});

router.post('/getChatUsers', function (req, res) {
  var mode = req.body.mode;
  var roomId = req.body.roomId;

  var selectSQL;

  if (mode === 'all')
    selectSQL = `SELECT * FROM roomParticipants WHERE roomNo=${roomId}`;
  else if (mode === 'online')
    selectSQL = `SELECT * FROM roomParticipants WHERE roomNo=${roomId} AND isOnline=1`;

  var result = connectDB.query(selectSQL);
  res.send(result);
});

router.post('/leaveUser', function (req, res) {
  var roomId = req.body.roomId;
  var roomType = connectDB.query(`SELECT roomType FROM room WHERE roomNo=${roomId}`)[0];
  var partnerId = req.body.partnerId; // 평가할 사용자 지정
  var rating = req.body.rating; // 사용자 별점
  var userGrade = connectDB.query(`SELECT grade FROM user WHERE id=${partnerId}`)[0];

  // 방 참여자 정보 업데이트
  var updateSQL = `UPDATE roomParticipants SET isPart=0 WHERE roomNo=${roomId} AND userId='${userId}'`;
  connectDB.query(updateSQL);

  if (userGrade <= 0) connectDB.query(`UPDATE user SET grade=${rating} WHERE id='${partnerId}`);
  else connectDB.query(`UPDATE user SET grade=${(rating + userGrade) / 2} WHERE id='${partnerId}`);

  if (roomType == 0) {
    connectDB.query(`DELETE FROM room WHERE roomNo=${roomId}`);
  }
});


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
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + file.originalname); // 타임스탬프 + 원래파일명으로 저장 (파일명이 중복되는 경우를 위해)
    }
  }),
});

var resultQNA = null; // q&a 글 내용 전역변수
var resultPostNum = null;

/* GET home page. */
router.get('/', function (req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS QNALIST(postIndex INT NOT NULL AUTO_INCREMENT, userId CHAR(30), category TEXT, title TEXT, content TEXT, secretOrNot BOOLEAN, filePaths TEXT, date DATETIME, PRIMARY KEY(postIndex)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");

  res.render('index', { title: 'Express' });
});

router.get('/c', function (req, res) {
  res.render('c');
});

router.get('/Usignup', function (req, res) {
  res.render('Usignup');
});

router.post('/Usignup', async function (req, res) {

  var id = req.body.Uid;
  var name = req.body.Uname;
  var pw = req.body.Upw;
  var phone = req.body.Unum;
  let email = req.body.Uemail;

  async function mailer() {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass // generated ethereal password
      }
    });

    // send mail with defined transport object
    let mailOptions = {
      from: testAccount.user,    // 발송 메일 주소 (위에서 작성한 gmail 계정 아이디)
      to: email,                     // 수신 메일 주소
      subject: '안녕하세요, 응답하라 익명인입니다! 이메일 인증을 해주세요.',   // 제목
      html: '<p>아래의 링크를 클릭해서 이메일 인증을 완료해주세요 !</p>' +
        "<a href='http:/" + req.get('host') + "/auth/?email=" + email + "&token=abcdefg'>이메일 인증하기</a>",  // 내용
      amp: `<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          </meta>
        </head>
        <body>
          <p>아래의 링크를 클릭해주세요!</br></p>
          <a href='http:/"` + req.get('host') + `/auth/?email=` + email + `&token=abcdefg'>인증하기</a>
        </body>
      </html>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      }
      else {
        console.log('Email sent: ' + info.response);
      }
    });
  }

  mailer();

  // console.log(id, name, pw, phone);

  // let transporter = nodemailer.createTransport({
  //   service: 'Gmail',
  //   port: 587,
  //   auth: {
  //     user: 'bok.jiho@gmail.com',  // gmail 계정 아이디를 입력
  //     pass: ''          // gmail 계정의 비밀번호를 입력
  //   }
  // });

  var salt = crypto.randomBytes(64).toString('hex');
  var hash = crypto.pbkdf2Sync(pw, salt, 129440, 64, 'sha512').toString('hex');

  var checkId = `SELECT COUNT(*) FROM user WHERE id = '${id}';`
  var checkNickname = `SELECT COUNT(*) FROM user WHERE name = '${name}';`
  var insertInfo = `INSERT INTO user(id, name, pw, phone, email, pwSalt) VALUES('${id}','${name}','${hash}','${phone}', '${email}', '${salt}')`

  var Uid = connectDB.query(checkId);
  var Unickname = connectDB.query(checkNickname);

  var id_length = Uid[0]['COUNT(*)'];
  var nick_length = Unickname[0]['COUNT(*)'];

  if (id_length >= 1) {
    res.send('<script>alert("이미 사용중인 ID입니다. 다른 ID를 입력해주세요."); document.location.href="/Usignup"</script>');
  }
  else if (nick_length >= 1) {
    res.send('<script>alert("이미 사용중인 닉네임입니다. 다른 닉네임을 입력해주세요."); document.location.href="/Usignup"</script>');
  }
  else {
    var Uinfo = connectDB.query(insertInfo);
    res.send(`<script>alert('회원가입이 완료되었습니다. 로그인 해주세요.'); document.location.href='/Ulogin';</script>`);
  }
});

router.get('/auth', function (req, res) {
  console.log(req.protocol + ":/" + req.get('host'));
  let email = req.body.email;
  let token = req.body.token;

  console.log(email)
  console.log(token);
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

  var checkId = `SELECT id FROM user;`;
  var sql1 = connectDB.query(checkId);
  var idFlag = 0;

  for (i = 0; i < sql1.length; i++) {
    if (sql1[i].id === id) {
      idFlag = 1;
      break;
    }
  }

  var checkPw = `SELECT pw, pwSalt FROM user WHERE id='${id}';`;
  var sql2 = connectDB.query(checkPw);
  if (idFlag) {
    if (sql2[0].pw === crypto.pbkdf2Sync(pw, sql2[0].pwSalt, 129440, 64, 'sha512').toString('hex')) {
      console.log('hiii');
      req.session.userId = id;
      req.session.userType = "user";

      var getemail = `SELECT email FROM user WHERE id='${req.session.userId}';`;
      req.session.userEmail = connectDB.query(getemail);

      res.send('<script>document.location.href="/chattingList"</script>');
    }
    else {
      console.log('why');
      res.send('<script>alert("비밀번호가 틀렸습니다. 다시 로그인하세요."); document.location.href="/Ulogin"</script>');
    }
  }
  else {
    res.send('<script>alert("존재하지 않는 아이디입니다!"); document.location.href="/Ulogin"</script>');
  }

  // var checkId = `SELECT COUNT(*) FROM user WHERE id = '${id}' and pw = '${pw}';`;
  // var Uid = connectDB.query(checkId)
  // var length = Uid[0]['COUNT(*)'];

  // if (length < 1) {
  //   res.send('<script>alert("Your information does not exist! Please sign up."); document.location.href="/Usignup"</script>')
  // }
  // else {
  //   if (!req.session.userId || !req.session.userType) {
  //     req.session.userId = id;
  //     req.session.userType = "user";
  //   }
  //   res.send('<script>document.location.href="/chattingList"</script>');
  // }
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

});

router.get('/logout', function (req, res) {
  delete req.session.userId;
  delete req.session.userEmail;
  res.redirect('/Ulogin');
});

router.get('/chattingList', function (req, res) {

  if (!req.session.userId) {
    res.redirect('/Ulogin');
  }
  else {
    res.render('chattingList', {
      userEmail: req.session.userEmail[0].email
    });
  }
});

// 방 목록 추가(사용자가 방 만들기를 통해서)
router.post('/addroomInfo', function (req, res) {
  var roomType = req.body.type;
  var title = req.body.title;
  var category = req.body.category;
  
  console.log(roomType, title, category);
  
  var sql = `INSERT INTO room (roomType, roomName, category, isActive) VALUES('${roomType}','${title}','${category}', 1)`;
  //var roomNo = req.body.roomNo;
  var id = connectDB.query(sql)['insertId'];
  
  //var addPartis = `INSERT INTO roomParticipants (roomNo, userId, lastIdx, isPart) VALUES(${id}, '${req.session.userId}', 0, 1)`;
  //connectDB.query(addPartis);
  
  res.send({roomId: id});
});

router.post('/getroomInfo', function (req, res) {
  var step = req.body.step;
  var category = req.body.category;
  step = step * 6;
  var sql = `SELECT * FROM room WHERE category=${category} LIMIT 6 OFFSET ${step}`;
  var result = connectDB.query(sql);
  res.send(result);
});

router.get('/qna', function (req, res) {

  if (!req.session.userId)
    res.redirect('/Ulogin');
  else {
    resultQNA = connectDB.query('SELECT COUNT(*) FROM QNALIST;')[0];
    var key1 = 'COUNT(*)';
    resultPostNum = Math.ceil(resultQNA[key1] / 10);

    res.render('qna_list', {
      pageNum: resultPostNum,
      userEmail: req.session.userEmail[0].email
    });
  }
});

router.get('/writepost', function (req, res) {
  connectDB.query("CREATE TABLE IF NOT EXISTS QNALIST(postIndex INT NOT NULL AUTO_INCREMENT, userId CHAR(30), category TEXT, title TEXT, content TEXT, secretOrNot TEXT, filePaths TEXT, date TEXT, response TEXT, repFlage INT, PRIMARY KEY(postIndex)) ENGINE=InnoDB DEFAULT CHARSET=utf8;");
  res.render('writepost', {
    userEmail: req.session.userEmail[0].email
  });
});

router.post('/qna_data', function (req, res) {

  var pageNum = req.body.pageNo;
  pageNum = (pageNum - 1) * 10;
  resultQNA = connectDB.query("SELECT * FROM QNALIST ORDER BY date DESC LIMIT 10 OFFSET " + pageNum);

  res.send(resultQNA);
});

router.post('/new_qna1', function (req, res) {
  var qnaTitle = req.body.qnaTitle;
  var qnaCategory = req.body.qnaCategory;
  var qnaContent = req.body.qnaContent;
  var qnaSecret = req.body.qnaSecret;

  if (qnaSecret == undefined)
    qnaSecret = 'unchecked';
  //userId 로그인 기능 추가하고 나중에 테이블에 저장
  var addPost = "UPDATE QNALIST SET category='" + qnaCategory + "', title='" + qnaTitle + "', content='" + qnaContent + "', secretOrNot='" + qnaSecret + "', userId='" + req.session.userId + "' WHERE postIndex=" + resultPostNum + ";";
  connectDB.query(addPost);

  // console.log(qnaTitle);
  // console.log(qnaContent);
  // console.log(qnaCategory);
  // console.log(qnaSecret);

  res.redirect('/qna');
});

router.get('/mainMenu', function (req, res) {
  res.render('mainMenu', { title: 'Express' });
});

router.get('/qna', function (req, res) {
  if (!req.session.userId)
    res.redirect('/Ulogin');
  else {
    res.render('qna_list', {
      userEmail: req.session.userEmail[0].email
    });
  }
});

router.get('/writepost', function (req, res) {
  res.render('writepost', {
    userEmail: req.session.userEmail[0].email
  });
});

router.get('/chattingRoom', function (req, res) {
  res.render('chattingRoom', {
    userEmail: req.session.userEmail[0].email
  });
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
      email VARCHAR(30),
      pwSalt TEXT,
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
      isActive INT,
      PRIMARY KEY(roomNo)
    )
  `

  sql[3] = `
    CREATE TABLE IF NOT EXISTS roomInfo(
      roomNo INT,
      userId VARCHAR(48)
    )
  `

  sql[4] = `
    CREATE TABLE IF NOT EXISTS chatdata(
      idx int(11) NOT NULL AUTO_INCREMENT,
      userID VARCHAR(64),
      chatroomID int(11),
      chatcontent text,
      chattime datetime,
      PRIMARY KEY(idx)
    ) DEFAULT CHARSET=utf8 COLLATE utf8_general_ci;
  `

  connectDB.query(sql[0]);
  connectDB.query(sql[1]);
  connectDB.query(sql[2]);
  connectDB.query(sql[3]);
  connectDB.query(sql[4]);

  res.redirect('/');
});

router.post('/new_qna2', upload.array('img', 5), function (req, res) {
  require('date-utils');
  var postDate = new Date();
  postDate = postDate.toFormat('YYYY-MM-DD HH24:MI:SS');
  // console.log(postDate);
  var len = req.files.length; // 등록한 첨부 파일 갯수
  var filePaths;
  if (len > 0) {
    filePaths = req.files[0].path.substring(6, req.files[0].path.length);
    for (i = 1; i < len; i++) {
      filePaths = filePaths + ', ' + req.files[i].path.substring(6, req.files[i].path.length);
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
router.get('/showpost', function (req, res) {
  if (!req.session.userId)
    res.redirect('/Ulogin');
  else {
    var pi = req.query.postIndex;

    var postResult = connectDB.query("SELECT * FROM QNALIST WHERE postIndex=" + pi);
    // console.log(postResult);

    var content = postResult[0].content;
    var reply = postResult[0].response;

    var filePath = postResult[0].filePaths.split(", ");
    console.log(filePath);

    content = content.replace(/(?:\\[rn]|[\r\n]+)+/g, "<br>");
    if (reply != null)
      reply = reply.replace(/(?:\\[rn]|[\r\n]+)+/g, "<br>");

    res.render('showpost', {
      userId: postResult[0].userId,
      pCategory: postResult[0].category,
      pTitle: postResult[0].title,
      pContent: content,
      pDate: postResult[0].date,
      pSecret: postResult[0].secretOrNot,
      pFilepath: filePath,
      pReply: reply,
      pFlag: postResult[0].repFlag,
      userEmail: req.session.userEmail[0].email
    });
  }
});

router.post('/reply_qna', function (req, res) {
  var replyContent = req.body.replyContent;
  var pi = req.body.postIndex;
  var flag = 1;

  var sql = "UPDATE QNALIST SET response='" + replyContent + "', repFlag='" + flag + "' WHERE postIndex=" + pi + ";";
  connectDB.query(sql);

  res.redirect('qna');
});

router.get('/mypage/information', function(req, res){
  if (!req.session.userId) {
    res.redirect('/Ulogin');
  }
  else {
    res.render('mp_personal', {
      userEmail: req.session.userEmail[0].email
    });
  }
});

router.get('/mypage/ratings', function(req, res){
  if (!req.session.userId) {
    res.redirect('/Ulogin');
  }
  else {
    res.render('mp_rate', {
      userEmail: req.session.userEmail[0].email
    });
  }
});
router.get('/mypage/chatlist', function(req, res){
  if (!req.session.userId) {
    res.redirect('/Ulogin');
  }
  else {
    var sql = `SELECT roomNo FROM roomParticipants WHERE userId='${req.session.userId}';`;
    var roomData = connectDB.query(sql);
    var sql3 = `SELECT MAX(chattime) FROM chatdata WHERE userId='${req.session.userId}';`;
    var chatTime = connectDB.query(sql3);

    if(roomData[0] == undefined){
      roomData = undefined;
      chatTime = undefined;
      var chatData = undefined;
    } else {
      var sql2 = `SELECT * FROM room WHERE roomNo='${roomData[0].roomNo}';`;
      var chatData = connectDB.query(sql2);
      // console.log(chatData);
    }
    res.render('mp_chat_record', {
      roomData: roomData,
      chatData: chatData,
      chatTime: chatTime,
      userEmail: req.session.userEmail[0].email
    });
  }
});

module.exports = router;


//지호
//문성희
//이선혜