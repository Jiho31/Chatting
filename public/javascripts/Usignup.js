var Uvalue;
var Uid = document.getElementById('Uid');
var Uname = document.getElementById('Uname');
var Unum = document.getElementById('Unum');
var Upassword = document.getElementById('Upw');

var UisValid = false;
var phone = /^\d{3}-\d{3,4}-\d{4}$/;

function checkPhoneNumber() {
        if (Unum.value == "") {
            UisValid = false;
            Unum.style.borderColor = 'red';
        }
        else if (phone.test(Unum.value) == false /*|| phone.test(Num.value) == false*/) {
            UisValid = false;
            Unum.style.borderColor = 'red';
        }
        else {
            UisValid = true;
            Unum.style.borderColor = "#e6e6e6";
        }
}

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

        if (Upassword.value == "") {
            UisValid = false;
            Upassword.style.borderColor = 'red';
        }
        else {
            UisValid = true;
            Upassword.style.borderColor = '#e6e6e6'
        }

   
}

function checkId() {
        if (Uid.value == "") {
            UisValid = false;
            Uid.style.borderColor = 'red';
        }
        else {
            UisValid = true;
            Uid.style.borderColor = '#e6e6e6'
        }
}

function userjoin(){
    if (UisValid) {
        //alert('Welcome user ' + Uname.value + '\nGo To Login');
        document.getElementById('user').submit();
        //document.location.href = '/Ulogin';
    }
}