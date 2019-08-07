var express = require('express');
var session = require('express-session');
// var mysql = require('sync-mysql');
var router = express.Router();
var socket_io = require('socket.io');
var io = socket_io();
router.io = io;

//socket 통신 소스

router.io.on('connection', socket => {

    socket.emit('connection', {
        type : 'connected'
    });

    socket.on('connection', data => {

        if(data.type === 'join') {

            socket.join(data.room);

            // depracated
            // socket.set('room', data.room);
            socket.room = data.room;

            socket.emit('system', {
                message : 'welcome to chat room!'
            });

            socket.broadcast.to(data.room).emit('system', {
                message : `${data.name} is connected`
            });
        }

    });

    socket.on('user', data => {

        // depracated
        // socket.get('room', (error, room) => {
        // });

        var room = socket.room;

        if(room) {
            socket.broadcast.to(room).emit('message', data);
        }
    });

});

router.use(session({
  secret: '1234DSFS@!',
  resave: false,
  saveUninitialized: true
}));

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

router.get('/chattingRoom', function(req, res) {
  res.render('chattingRoom');
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
