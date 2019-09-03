$('.ui.dropdown').dropdown();

var listCont = $('#listbody');

var getData = function (cat) {
    console.log(cat);
    $.post('/getroomInfo', {
        step: window.scrollStep,
        category: cat
  }, function (data) {
            makeList(data);
            if (!window.isScrolled && $(window).height() >= $(document).height()) {
                window.scrollStep++;
                getData(cat)
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

var actionScroll = function (cat) {
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
            getData(cat);
        }
    });
    getData(cat);
}

$(document).ready(function () {
    window.selectedCategory = 0;
    actionScroll(window.selectedCategory);
    $('.button.selector').on('click', function () {
        $('.button.selector').removeClass('selected');
        $(this).addClass('selected');
    });
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
                /* 대화방 열기*/
                document.location.href = `javascript:void(window.open('http://52.79.233.145:3000/chattingRoom?roomId=${roomId}','win0', 'left='+(screen.availWidth-521)/2+',top='+(screen.availHeight-768)/2+', width=521px,height=768px'))`;
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
        category: window.selectedCategory,
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

// 카테고리 선택지 나열

//submit 버튼 누르면 모달 닫힘
submitBtn.onclick = function () {
    roomModal.style.display = "none";
    submit();
}

var accountModal = document.getElementById('account_Modal');

//cancel 버튼 누르면 모달 닫힘
cancelBtn.onclick = function () {
    roomModal.style.display = "none";
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

//게시판 글 내용 적는 곳
$(function () {
    //기본값
    $('#message_board_content').hide();
    //숨기기
    $('#chat_1').click(function () {
        $('#message_board_content').hide();
    });
    //보이기
    $('#chat_2').click(function () {
        $('#message_board_content').show();
    });
});

var selectCategory = function(arg) {
    window.selectedCategory = arg;
    actionScroll(arg);
}