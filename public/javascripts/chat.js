$('.ui.dropdown').dropdown();

var listCont = $('#listbody');

var getData = function () {
  $.post('/getroomInfo', {
    step: window.scrollStep
  }, function (data) {
    makeList(data);
    if (!window.isScrolled && $(window).height() >= $(document).height()) {
      window.scrollStep++;
      getData(window.scrollStep)
    }
    console.log(data);
  }, 'json')
}

var makeList = function (data) {
  var html = '';

  for (var i = 0; i < data.length; i++) {
    html += `
                <div class="column">
                    <div class="ui segment">
                        <p>제목: ${data[i].roomName}</p>
                        <p>카테고리: ${data[i].category}</p>
                        <p>평점: ${data[i].rating}</p>
                    </div>
                </div>
            `;
  }
  listCont.append(html);
}

var actionScroll = function () {
  window.scrollStep = 0;
  window.isScrolled = false;

  $(window).scroll(function () {
    window.isScrolled = true;

    let $window = $(this);
    let scrollTop = $window.scrollTop();
    let windowHeight = $window.height();
    let docHeight = $(document).height();

    if (scrollTop + windowHeight + 1 > docHeight) {
      window.scrollStep++;
      getData(window.scrollStep);
    }
  });
  getData(window.scrollStep);
}

$(document).ready(function () {
  actionScroll();
});


var roomModal = document.getElementById('room_modal');

// opens the modal
var roomBtn = document.getElementById("room_btn");

// closes the modal
var roomSpan = document.getElementsByClassName("room-close")[0];

//submit 버튼
var submitBtn = document.getElementsByClassName("ui secondary submit button")[0];

//cancel 버튼
var cancelBtn = document.getElementsByClassName("ui grey button")[0];

var roomType = 0;

function roomMode(arg) {
    if (arg == 0) {
        roomType = 0;
    }
    else {
        roomType = 1;
    }

    document.getElementById('roomType').value = roomType;
    //console.log(type);
}

function submit() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/addroomInfo', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            if (xhr.responseText.includes("error: ")) {
                alert("The error occurred while inserting.");
            }
            else {
                //closeModal();
                roomId = JSON.parse(xhr.responseText).roomId;
                /* 대화방 */
                //document.location.href = "/roomChatting";
                $('#listbody').empty();
                actionScroll();
                
                }
        }
    }

    console.log(document.getElementById('title').value);
    console.log($("#category option:selected").val());
    console.log(roomType);

    xhr.send(JSON.stringify({
        title: document.getElementById('title').value,
        category: $("#category option:selected").val(),
        type: roomType
    }));
}

function getroomInfo(cnt) {
    $.post("/getroomInfo", {
        step: cnt,
    }, function (data) {
    
    }, 'json')
        .done(function (data) {
        })
        .fail(function (data) {
            alert("error");
        })
}

function getroomInfoForId(no) {
    $.post("/getroomInfoForId", {
        roomNo: no,
    }, function (data) {

    }, 'json')
        .done(function (data) {
        })
        .fail(function (data) {
            alert("error");
        })
}

// open the modal 
roomBtn.onclick = function () {
    roomModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
roomSpan.onclick = function () {
    roomModal.style.display = "none";
}

//채팅 방식 선택할 때 뒤에 네모 박스
$(document).ready(function () {
    $('.button.selector').on('click', function () {
        $('.button.selector').removeClass('selected');
        $(this).addClass('selected');
    });
});

// 카테고리 선택지 나열

//submit 버튼 누르면 모달 닫힘
submitBtn.onclick = function () {
    roomModal.style.display = "none";
    submit();
}

//cancel 버튼 누르면 모달 닫힘
cancelBtn.onclick = function () {
    roomModal.style.display = "none";
}

// Get the modal
var accountModal = document.getElementById('account_Modal');

// Get the button that opens the modal
var accountBtn = document.getElementById("account_Btn");

// Get the <span> element that closes the modal
var accountSpan = document.getElementsByClassName("account-close")[0];

// When the user clicks on the button, open the modal 
accountBtn.onclick = function () {
    accountModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
accountSpan.onclick = function () {
    accountModal.style.display = "none";
}

// 
window.onclick = function (event) {
    if (event.target == accountModal) {
        accountModal.style.display = "none";
    }
    else if (event.target == roomModal) {
        roomModal.style.display = "none";
    }
}