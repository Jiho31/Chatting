$('.ui.dropdown').dropdown('');
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
    getroomInfo(0);
});

var scrollCnt = 0;

$(document).scroll(function () {
    var maxHeight = $(document).height();
    var currentScroll = $(window).scrollTop() + $(window).height();

    if (maxHeight <= currentScroll + 100) {
        scrollCnt++;
        getroomInfo(scrollCnt);
    }
})

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

function getroomInfo(cnt) {
    $.post("/getroomInfo", {
        step: cnt,
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

function getroomInfoForId(no) {
    $.post("/getroomInfoForId", {
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

    $('#body').append(`
<div class="line" style="margin-top: 30px;">
    <div class="box" style = "margin-right: 30px">
        <div style="margin: 51.5px auto 0 auto;     text-align: center;">
            <div class="room-info">
                <div class="category" id="category1"></div>
                <div class="title" id="title1"></div>
            </div>
            <div class="grade" id="grade1">★★☆☆☆</div>
            <div class="mode" id="roomType1"></div>
        </div>
    </div>
    <div class="box" style = "margin-right: 30px ">
        <div style="margin: 51.5px auto 0 auto; text-align: center;">
            <div class="room-info">
                <div class="category" id="category1"></div>
                <div class="title" id="title1"></div>
            </div>
            <div class="grade" id="grade1">★★☆☆☆</div>
            <div class="mode" id="roomType1"></div>
        </div>
    </div>
</div>

<div class="line" style="margin-top: 30px;">
    <div class="box" style = "margin-right: 30px">
        <div style="margin: 51.5px auto 0 auto; text-align: center;">
            <div class="room-info">
                <div class="category" id="category1"></div>
                <div class="title" id="title1"></div>
            </div>
            <div class="grade" id="grade1">★★☆☆☆</div>
            <div class="mode" id="roomType1"></div>
        </div>
    </div>
    <div class="box" style = "margin-right: 30px">
        <div style="margin: 51.5px auto 0 auto; text-align: center;">
            <div class="room-info">
                <div class="category" id="category1"></div>
                <div class="title" id="title1"></div>
            </div>
            <div class="grade" id="grade1">★★☆☆☆</div>
            <div class="mode" id="roomType1"></div>
        </div>
    </div>
</div>


<div class="line" style="margin-top: 30px;">
    <div class="box" style = "margin-right: 30px">
        <div style="margin: 51.5px auto 0 auto; text-align: center;">
            <div class="room-info">
                <div class="category" id="category1"></div>
                <div class="title" id="title1"></div>
            </div>
            <div class="grade" id="grade1">★★☆☆☆</div>
            <div class="mode" id="roomType1"></div>
        </div>
    </div>
    <div class="box" style = "margin-right: 30px">
        <div style="margin: 51.5px auto 0 auto; text-align: center;">
            <div class="room-info">
                <div class="category" id="category1"></div>
                <div class="title" id="title1"></div>
            </div>
            <div class="grade" id="grade1">★★☆☆☆</div>
            <div class="mode" id="roomType1"></div>
        </div>
    </div>
</div>

    `);

    for (var i = 0; i < data.length; i++) {
        var category = data[i].category;
        var title = data[i].roomName;
        var roomType = data[i].roomType;

        var html = "";
        var bodyWrap = 'body';

        $('.box').eq(i + scrollCnt * 6).html(
            `<div class="box1">
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