$(document).ready(function () {
    $('.ui .item').on('click', function () {
        // ignored 클래스 가지면 무시
        if ($(this).hasClass('ignored')) {
            return;
        }
        $('.ui .item').removeClass('active');
        $(this).addClass('active');
    });       
});

function accountModalFunction(userEmail){
    var html = '';

    html += '<div id="account_Modal" class="account-modal">';
    html += '<!-- Modal content -->';
    html += '<div class="account-modal-content">';
    html += '<span class="account-close">&times;</span>';
    html += '<div class="ui tag label">';
    html += '<a class="my-email">'+userEmail+'</a>';
    html += '</div>';

    html += '<div class="account-button">';
    html += '<button class="ui basic button" onclick="location=' + "'/mypage/information'" + '">';
    html += '<i class="icon user"></i>';
    html += 'My page';
    html += '</button>';

    html += '<button class="ui basic button" onclick="location=' + "'/logout'" + '">';
    html += '<i class="icon sign-out"></i>';
    html += 'Logout';
    html += '</button>';
    html += '</div>';
    html += '</div>';
    html += '</div>';

    $('body').append(html);

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

    var accountBtn2 = document.getElementById("account_Btn2");

    // When the user clicks on the button, open the modal 
    accountBtn2.onclick = function () {
        accountModal.style.display = "block";
    }


    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == accountModal) {
            accountModal.style.display = "none";
        }
    }
}

