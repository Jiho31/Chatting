var Uvalue;
var Uid = document.getElementById('Uid');
var Uname = document.getElementById('Uname');
// var Unum = document.getElementById('Unum');
var Upassword = document.getElementById('Upw');
var UcheckPw = document.getElementById('UpwCheck');
var Uemail = document.getElementById('Uemail');

var UisValid = false;
var re_id = /^[a-zA-Z0-9_]{4,12}$/; // 4-12자 영문 + 숫자 + 특수문자 _
var re_pw = /^[a-zA-Z0-9]{6,12}$/; // 6-12자 영문 + 숫자
// var re_phone = /^[0-9]{11}$/; // 숫자 11자리
var re_email = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;

// function checkPhoneNumber() {
//         if (Unum.value == "") {
//             UisValid = false;
//             Unum.style.borderColor = 'red';
//         }
//         else if (re_phone.test(Unum.value) == false) {
//             UisValid = false;
//             Unum.style.borderColor = 'red';
//         }
//         else {
//             UisValid = true;
//             Unum.style.borderColor = "#e6e6e6";
//         }
// }

function checkName() {
        if (Uname.value == "") {
            UisValid = false;
            Uname.style.borderColor = 'red';
        }
        else {
            UisValid = true;
            Uname.style.borderColor = '#e6e6e6';
        }
    }

function checkPw() {
        if (Upassword.value == "" || (re_pw.test(Upassword.value) == false)) {
            UisValid = false;
            Upassword.style.borderColor = 'red';
        }
        else {
            UisValid = true;
            Upassword.style.borderColor = '#e6e6e6'
        }
}

function checkSamePw(){
    if (Upassword.value != UcheckPw.value){
        UisValid = false;
        UcheckPw.style.borderColor = 'red';
        $('#pwcheck').attr('data-tooltip', '비밀번호가 일치하지 않습니다. 다시 입력해주세요.').attr('data-position', 'bottom left');
    }
    else {
        UisValid = true;
        UcheckPw.style.borderColor = '#e6e6e6'
        $('#pwcheck').removeAttr('data-tooltip').removeAttr('data-position');
    }
}

function checkId() {
        if (Uid.value == "") {
            UisValid = false;
            Uid.style.borderColor = 'red';
        }
        else if (re_id.test(Uid.value) == false){
            UisValid = false;
            Uid.style.borderColor = 'red';
        }
        else {
            UisValid = true;
            Uid.style.borderColor = '#e6e6e6'
        }
}

function checkEmail(){
    if (Uemail.value == "") {
        UisValid = false;
        Uemail.style.borderColor = 'red';
    }
    else if (re_email.test(Uemail.value) == false) {
        UisValid = false;
        Uemail.style.borderColor = 'red';
    }
    else {
        UisValid = true;
        Uemail.style.borderColor = '#e6e6e6';
    }
}

function userjoin(){
    checkEmail();
    checkId();
    checkSamePw();
    checkPw();
    checkName();

    if (UisValid) {
        //alert('Welcome user ' + Uname.value + '\nGo To Login');
        document.getElementById('user').submit();
        //document.location.href = '/Ulogin';
    }
    else {
        alert('입력값들을 확인하세요.');
    }
}