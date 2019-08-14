
var socket = io();

socket.on('news', function (data) {
    console.log(data);
    socket.emit('my oher event', {my: 'data'});
});


var serverURL = '52.79.233.145:3000';

var name = 'me';
var room = '100';



 // Get the button that opens the modal
 var exitBtn = document.getElementById("exit_Button");

// When the user clicks on the button, open the modal 
exitBtn.onclick = function() {
    $('.ui.basic.modal')
    .modal('show')
  ;
;
}

 // Get the button that opens the modal
 var frownBtn = document.getElementById("warning_button");


// When the user clicks on the button, open the modal 
frownBtn.onclick = function() {
   
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


function writeMessage(type, name, message) {
    var html = '<div>{MESSAGE}</div>';

    var printName = '';
    if(type === 'me') {
        printName = name + ' : ';
    }

    html = html.replace('{MESSAGE}', printName + message + '  ' + '<span class="time">' + getTimeStamp() + '</span>');

    $(html).appendTo('.chat-message');
    $('body').stop();
    $('body').animate({scrollTop:$('body').height()}, 500);

}

function sender(text) {

    if(text.length < 1  ) return;

    socket.emit('user', {
        name : name,
        message : text
    });

    writeMessage('me', name, text);
}

$(document).ready(function() {

    socket.on('connection', function(data) {
        console.log('connect');
        if(data.type === 'connected') {
            socket.emit('connection', {
                type : 'join',
                name : name,
                room : room


            });
        }
     
    });

    socket.on('system', function(data) {
        writeMessage('system', 'system', data.message);
    });

    socket.on('message', function(data) {
        writeMessage('other', data.name, data.message);
    });

    $('#message-button').click(function() {

        var $input = $('#message-input');

        var msg = $input.val();
        sender(msg);
        $input.val('');
        $input.focus();


    });

    $('#message-input').on('keypress', function(e) {

        if(e.keyCode === 13) {

            var $input = $('#message-input');

            var msg = $input.val();
            sender(msg);
            $input.val('');
            $input.focus();
        }
    });

});

//별점
$('.rating')
  .rating({
    initialRating: 3,
    maxRating: 5
  })
;

