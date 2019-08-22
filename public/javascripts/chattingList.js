$('.ui.dropdown').dropdown();

/*상단바 왼쪽*/
$(document).ready(function () {
    $('.ui .item').on('click', function () {
        // ignored 클래스 가지면 무시
        if ($(this).hasClass('ignored')) {
            return;
        }
        $('.ui .item').removeClass('active');
        $(this).addClass('active');
    });
    getroomInfo('ALL');
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
                document.location.href=`javascript:void(window.open('http://52.79.233.145:3000/chattingRoom?roomId=${roomId}','win0', 'left='+(screen.availWidth-521)/2+',top='+(screen.availHeight-768)/2+', width=521px,height=768px'))`;
                //document.location.href = "/roomChatting";
                getroomInfo('ALL');
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

function getroomInfo(no) {
    $.post("/getroomInfo", {
        roomNo: no,
    }, function (data) {
        console.log(data);
        makeChatRoomList(data);
    }, 'json')
        .done(function (data) {
        })
        .fail(function (data) {
            alert("error");
        })
}



function makeChatRoomList(data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
        var roomId = data[i].roomNo;
        var category = data[i].category;
        var title = data[i].roomName;
        var roomType = data[i].roomType;

        var html = "";
        var bodyWrap = 'body';
        var method = `javascript:void(window.open('http://52.79.233.145:3000/chattingRoom?roomId=${roomId}','win0', 'left='+(screen.availWidth-521)/2+',top='+(screen.availHeight-768)/2+', width=521px,height=768px'))`;

        $('.box').eq(i).html(
            `<div class="box1" onclick="${method}">
                    <div style="margin: 51.5px auto 0 auto">
                        <div class="room-info">
                            <div class="title" id="title1"><span>[${category}]</span>${title}</div>
                        </div>
                        <div class="grade" id="grade1">★★☆☆☆</div>
                        <div class="mode" id="roomType1">${roomType == 0 ? '1대 1' : '게시판'}</div>
                    </div>
                </div>`
        );
    }
    console.log(html);
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

        //게시판 글 내용 적는 곳
        $(function(){
            //기본값
            $('#message_board_content').hide();
            //숨기기
            $('#chat_1').click(function(){
                $('#message_board_content').hide();
            });
            //보이기
            $('#chat_2').click(function(){
                $('#message_board_content').show();
            });
        });