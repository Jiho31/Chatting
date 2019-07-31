var Mvalue;
var Mid = document.getElementById('Mid');
var Mpassword = document.getElementById('Mpw');

var MisValid = false;

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

function managerlogin(){
    console.log('mlogin');
    if (MisValid) {
        console.log('test ok');
        alert('welcome' + Mid.value + '\n' + 'succeed login');
        document.getElementById('manager').submit();
    }
}