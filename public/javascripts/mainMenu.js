$(document).ready(function () {
    $('.ui .item').on('click', function() {
        $('.ui .item').removeClass('active');
        $(this).addClass('active');
    });          
});