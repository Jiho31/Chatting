
var socket = io();
var roomId = parseInt(window.location.search.replace('?roomId=', ''));


var name = 'me';
var room = '100';



// Get the button that opens the modal
var exitBtn = document.getElementById("exit_Button");

// When the user clicks on the button, open the modal 
exitBtn.onclick = function () {
  $('.ui.basic.modal')
    .modal('show')
    ;
  ;
}

// Get the button that opens the modal
var frownBtn = document.getElementById("warning_button");


// When the user clicks on the button, open the modal 
frownBtn.onclick = function () {

  $('.tiny.modal')
    .modal({
      blurring: true
    })
    .modal('show')
    ;
  ;
}


//메세지 보낸 시간
// document.write(getTimeStamp() + '<br />');

function getTimeStamp() {
  var d = new Date();
  var s =
    leadingZeros(d.getFullYear(), 4) + '-' +
    leadingZeros(d.getMonth() + 1, 2) + '-' +
    leadingZeros(d.getDate(), 2) + ' ' +

    leadingZeros(d.getHours(), 2) + ':' +
    leadingZeros(d.getMinutes(), 2) + ':' +
    leadingZeros(d.getSeconds(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}


function writeMessage(type, name, message, time) {
  var html = '<div>{MESSAGE}</div>';

  var printName = '';
  if (type != 'system') {
    printName = name + ' : ';
  }

  html = html.replace('{MESSAGE}', printName + message + '  ' + '<span class="time">' + time + '</span>');

  $(html).appendTo('.chat-message');
  $('body').stop();
  //$(document).animate({ scrollTop: $(document).height() }, 500);
  var chatAreaHeight = $("body").height();
  var maxScroll = $(".chat-box").height() - chatAreaHeight + 128;
  $(document).scrollTop(maxScroll);
}



function sender(text) {

  if (text.length < 1) return;

  $.post('/getCurrentUserId', function(uid) {
    socket.emit('user', {
      name: uid,
      roomId: roomId,
      message: text,
      sendtime: getTimeStamp()
    });

    writeMessage('me', uid, text, getTimeStamp());
  });


}

$(document).ready(function () {
 

  // 연결
  socket.on('connection', function (data) {
    console.log('connect');
    if (data.type === 'connected') {
      $.post('/getCurrentUserId', function(uid) {
        socket.emit('connection', {
          type: 'join',
          name: uid,
          room: roomId
        });
      });
    }
  });

  socket.on('system', function (data) {
    //ajax로 이전 채팅 내용 불러들이기(방 번호 전달해서)
    $.post("/getChatHistory", {
      roomId: roomId,
      }, function (data) {
        console.log(data);
        for (var i = 0; i < data.length; i++) {
          writeMessage('me', data[i].userID, data[i].chatcontent, data[i].chattime);
        }
      }, 'json')
      .done(function (data) {})
      .fail(function (data) {
        alert("error");
      });
    writeMessage('system', 'system', data.message, getTimeStamp());
  });

  socket.on('message', function (data) {
    console.log(data);
    writeMessage('other', data.name, data.message, data.sendtime);
  });

  $('#message-button').click(function () {

    var $input = $('#message-input');

    var msg = $input.val();
    sender(msg);
    $input.val('');
    $input.focus();
  });

  $('#message-input').on('keypress', function (e) {

    if (e.keyCode === 13) {

      var $input = $('#message-input');

      var msg = $input.val();
      sender(msg);
      $input.val('');
      $input.focus();
    }
  });

});

// 1대1채팅 인원 제한하기
$.post('/getRoomInfo', {
  step: roomId,
}, function(data) {
  var roomType = data[0].roomType;
  console.log(roomType);
  
  $.post('/getChatUsers', {
    mode: 'all',
    roomId: roomId 
  },function(data) {
     window.chatUsers = data;

     if(roomType === 0 && data.length >= 2) {
      
       alert("더 이상 접속하실 수 없는 대화방 입니다.");
       window.close();
     }
   });
});


socket.on('news', function (data) {
  console.log(data);
  socket.emit('my oher event', { my: 'data' });
});



//별점
$('.rating')
  .rating({
    initialRating: 3,
    maxRating: 5
  })
  ;

  //상단바 고정
  // $( document ).ready( function() {
  //   var roomMenu = $( '.ui grey fixed inverted massive menu' ).offset();
  //   $( window ).scroll( function() {
  //     if ( $( document ).scrollTop() > roomMenu.top ) {
  //       $('.ui grey fixed inverted massive menu').addClass( 'fixed' );
  //     }
  //     else {
  //       $('.ui grey fixed inverted massive menu').removeClass( 'fixed' );
  //     }
  //   });
  // } );
  
