$('.ui.dropdown').dropdown('');

$(document).ready(function () {
    $('.ui .item').on('click', function() {
        // ignored 클래스 가지면 무시
        if($(this).hasClass('ignored')) {
            return;
        }
        $('.ui .item').removeClass('active');
        $(this).addClass('active');
    });          
});

var roomModal = document.getElementById('room_modal');
 
// Get the button that opens the modal
var roomBtn = document.getElementById("room_btn");

// Get the <span> element that closes the modal
var roomSpan = document.getElementsByClassName("room-close")[0];  

//submit 버튼
var submitBtn = document.getElementsByClassName("ui secondary submit button")[0];

//cancel 버튼
var cancelBtn = document.getElementsByClassName("ui grey button")[0];



// When the user clicks on the button, open the modal 
roomBtn.onclick = function() {
    roomModal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
roomSpan.onclick = function() {
    roomModal.style.display = "none";
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
submitBtn.onclick = function() {
    roomModal.style.display = "none";
}

//cancel 버튼 누르면 모달 닫힘
cancelBtn.onclick = function() {
    roomModal.style.display = "none";
}

   // Get the modal
   var accountModal = document.getElementById('account_Modal');
 
   // Get the button that opens the modal
   var accountBtn = document.getElementById("account_Btn");

   // Get the <span> element that closes the modal
   var accountSpan = document.getElementsByClassName("account-close")[0];                                          

   // When the user clicks on the button, open the modal 
   accountBtn.onclick = function() {
       accountModal.style.display = "block";
   }

   // When the user clicks on <span> (x), close the modal
   accountSpan.onclick = function() {
       accountModal.style.display = "none";
   }

   // 
   window.onclick = function(event) {
       if (event.target == accountModal) {
           accountModal.style.display = "none";
       }
       else if (event.target == roomModal) {
        roomModal.style.display = "none";
    }
   }

