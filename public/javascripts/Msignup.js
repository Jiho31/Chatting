var Mvalue;
var Mnum = document.getElementById('Mid');
var Mname = document.getElementById('Mname');
var Mnum = document.getElementById('Mnum');
var Mpassword = document.getElementById('Mpw');

var MisValid = false;
var phone = /^\d{3}-\d{3,4}-\d{4}$/;

function checkPhoneNumber() {
    if (Mnum.value == "") {
        MisValid = false;
        Mnum.style.borderColor = 'red';
    }
    else if (phone.test(Mnum.value) == false) {
        MisValid = false;
        Mnum.style.borderColor = 'red';
    }
    else {
        MisValid = true;
        Mnum.style.borderColor = "#e6e6e6";
    }
}

function checkName() {

    if (Mname.value == "") {
        MisValid = false;
        Mname.style.borderColor = 'red';
    }
    else {
        MisValid = true;
        Mname.style.borderColor = '#e6e6e6';
    }
}

function checkPw() {
    if (Mpassword.value == "") {
        MisValid = false;
        Mpassword.style.borderColor = 'red';
    }
    else {
        MisValid = true;
        Mpassword.style.borderColor = '#e6e6e6'
    }
}

function checkId() {
    if (Mid.value == "") {
        MisValid = false;
        Mid.style.borderColor = 'red';
    }
    else {
        MisValid = true;
        Mid.style.borderColor = '#e6e6e6'
    }
}

function managerjoin() {
    if (MisValid) {
        alert('Welcome user ' + Mname.value + '\nGo To Login');
        document.getElementById('manager').submit();
        //document.location.href = '/Mlogin';
    }
}