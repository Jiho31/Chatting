var Uvalue;
var Uid = document.getElementById('Uid');
var Upassword = document.getElementById('Upw');

var UisValid = false;

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

function userlogin(){
    console.log('ulogin');
    if (UisValid) {
        console.log('test ok');
        alert('welcome' + Uid.value + '\n' + 'succeed login');
        document.getElementById('user').submit();
    }
}