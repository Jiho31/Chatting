$(document).ready(function () {
    $('.ui .item').on('click', function() {
        // ignored 클래스 가지면 무시
        if($(this).hasClass('ignored')) {
            return;
        }
        $('.ui .item').removeClass('active');
        $(this).addClass('active');
    });         
    
    $('.page-num:first-child').css('font-weight', 'bold');

    // $('.page-num').click(function() {
    //     // console.log("page clicked");
    //     var params = parseInt(this.innerHTML);
    //     getWritePost(params);
    //     window.qnaPageNum = params; // 글로벌 변수에 현재 페이지 값 저장
    
    //     $('.page-num').css('font-weight', 'normal');
    //     $(this).css('font-weight', 'bold');
    // });

    // window.qnaPageNum 초기값 14
    window.pageSet = Math.ceil(window.qnaPageNum/10);
    window.pageRemains = Math.floor(window.qnaPageNum % 10);
    window.pageFlag = 0; // pagination함수에 전달되는 매개변수 step의 초기값과 같다

    function pagination(step){
        var html = '';
        if (step == window.pageSet - 1){
            for (var i = 1 + step * 10; i <= step * 10 + window.pageRemains; i++){
                html += '<a class="item page-num">';
                html += i;
                html += '</a>';
            }
        }
        else {
            for (var i = 1 + step * 10; i <= (1 + step) * 10; i++){
                html += '<a class="item page-num">';
                html += i;
                html += '</a>';
            }
        }
        $('#pagination_id').html(html);

        $('.page-num').click(function() {
            // console.log("page clicked");
            var params = parseInt(this.innerHTML);
            getWritePost(params);
            window.qnaPageNum = params; // 글로벌 변수에 현재 페이지 값 저장
        
            $('.page-num').css('font-weight', 'normal');
            $(this).css('font-weight', 'bold');
        });
    }   

    pagination(window.pageFlag); // 처음 pagination 나타내기
    $('.page-num').triggerHandler('click', '1');
    
    $('#left_page').click(function(){
        if (window.pageFlag <= 0) {
            console.log('왼쪽 클릭 안됨');
        }
        else {
            window.pageFlag--;
            pagination(window.pageFlag);
            $('.page-num').triggerHandler('click', window.pageFlag*10 + 1);
        }

        // if (window.pageFlag <= 0) {
        //     console.log('왼쪽 클릭 안됨');
        // }
        // else {
        //     //document.getElementById('left_page').style.cursor = 'pointer';
        //     window.pageFlag--;
        //     pagination(window.pageFlag);
        //     $('.page-num').triggerHandler('click', window.pageFlag*10 + 1);
        //     if (window.pageFlag <= 0){
        //         $('#left-icon').css('color', 'grey !important');
        //         console.log('hi');
        //     }
        //     $('#right-icon').css('color', 'black !important');
        // }        
    });

    $('#right_page').click(function(){
        if (window.pageFlag == window.pageSet-1){
            console.log('right 이벤트 해제');
        }
        else {
            window.pageFlag++;
            pagination(window.pageFlag);
            $('.page-num').triggerHandler('click', window.pageFlag*10 + 1);
        }
        // if (window.pageFlag == window.pageSet-1){
        //     console.log('right 이벤트 해제');
        // }
        // else {
        //     window.pageFlag++;
        //     pagination(window.pageFlag);
        //     $('.page-num').triggerHandler('click', window.pageFlag*10 + 1);
        //     $('#left-icon').css('color', 'black !important');
        // }
    });

    getWritePost(1);
});

var getWritePost = function(pageNum) {
    // ajax post로 페이지 번호 넘겨서 데이터 받아오기
    $.ajax({
        url: '/qna_data',
        type: "POST",
        data: {pageNo: pageNum},
        dataType: "json",
        success: eventSuccess,
        error: eventError
    });

    // 받아온 데이터로 글 목록 만들기
    function eventSuccess(data){
        var html = '';

        for(var i = 0; i < data.length; i++) {
            html += `<tr>`;
            html += `<td colspan="1">${data[i].postIndex}</td>`;
            html += `<td colspan="4" style="text-overflow: ellipsis; overflow: hidden;"><a href="/showpost?postIndex=${data[i].postIndex}">[${data[i].category}] ${data[i].title}</a></td>`;
            html += `<td colspan="2">${data[i].date.substring(0,10)}</td>`;
            html += `<td colspan="2" style="text-overflow: ellipsis; overflow: hidden;">비공개</td>`;
        }

        $('#qna_ajax').html(html);
    }

    function eventError(){
        alert('Error!');
    }
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

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == accountModal) {
            accountModal.style.display = "none";
        }
    }