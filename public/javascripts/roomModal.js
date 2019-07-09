var modal = document.getElementById('room_modal');
 
// Get the button that opens the modal
var btn = document.getElementById("room_btn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("room-close")[0];  

//submit 버튼
var submit_btn = document.getElementsByClassName("ui secondary submit button")[0];

//cancel 버튼
var cancel_btn = document.getElementsByClassName("ui grey button")[0];



// When the user clicks on the button, open the modal 
btn.onclick = function() {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

//채팅 방식 선택할 때 뒤에 네모 박스
$(document).ready(function () {
    $('.button.selector').on('click', function() {
        $('.button.selector').removeClass('selected');
        $(this).addClass('selected');
    });});

// 카테고리 선택지 나열
$('.ui.dropdown')
  .dropdown()
;

//submit 버튼 누르면 모달 닫힘
submit_btn.onclick = function() {
    modal.style.display = "none";
}

//cancel 버튼 누르면 모달 닫힘
cancel_btn.onclick = function() {
    modal.style.display = "none";
}

