$(document).ready(function(){
    var ctx = document.getElementById("myChart").getContext('2d');
    var x_labels = ['월', '화', '수', '목', '금', '토', '일']; // 나중에 클릭 이벤트에 따라 값 수정하기
    var chartdata = {
        type: 'line',
        data: {
            labels: x_labels,
            datasets: [{
                label: '내 평점',
                data: [4, 3, 3.5, 4.1, 4.8, 4.4, 2.5, 3.7, 4],
                borderwidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    };
    new Chart(ctx, chartdata);


    $('.ui.rating').rating('disable');
});