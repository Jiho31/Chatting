$(document.head).append(`
<style>
.star-ratings {
    width: fit-content;
    unicode-bidi: bidi-override;
    color: #ccc;
    font-size: 64px;
    position: relative;
    margin: 0;
    padding: 0;
}

.star-ratings>.fill-ratings {
    color: #ffd900;
    padding: 0;
    position: absolute;
    z-index: 1;
    display: block;
    top: 0;
    left: 0;
    overflow: hidden;
    transition: width 1s cubic-bezier(0.76, 0.01, 0.29, 1);
}

.star-ratings>.fill-ratings>span {
    display: inline-block;
    letter-spacing: 8px;
}

.star-ratings>.empty-ratings {
    padding: 0;
    display: block;
    z-index: 0;
}

.star-ratings>.empty-ratings>span {
    letter-spacing: 8px;
}
</style>
`);

$('.star-ratings').__proto__.initstars = function(opt = {
    /**
     * @param backgroundColor 별 배경 색
     * @param color 별 색상
     * @param glowColor 별 테두리 색상
     * @param size 별 크기
     * @param spacing 별 간격
     * @param value 별점 값(퍼센트)
     * @param onChange 값 변화 시 호출 함수
     */
    backgroundColor: '#ccc',
    color: '#ffd900',
    glowColor: '#ffd900',
    size: 64,
    spacing: 8,
    value: 50,
    onChange: () => {}
}) {
    var _opt = {
        backgroundColor: !opt.backgroundColor ? '#ccc' : opt.backgroundColor,
        color: !opt.color ? '#ffd900' : opt.color,
        glowColor: !opt.glowColor ? '#ffd900' : opt.glowColor,
        size: !opt.size ? 64 : opt.size,
        spacing: !opt.spacing ? 8 : opt.spacing,
        value: !opt.value ? 0 : opt.value,
    }
    $(this).empty();
    $(this).css({'font-size': `${_opt.size}px`, 'color': `${_opt.backgroundColor}`, 'padding-left': `${_opt.spacing}px`});
    $(this).append(`
        <div class="fill-ratings" style="width:0px;padding-left:${_opt.spacing}px;color:${_opt.color};text-shadow:${_opt.glowColor} 0px 0px 4px;height:${_opt.size}px">
            <span style="letter-spacing:${_opt.spacing}px">★★★★★</span>
        </div>
        <div class="empty-ratings">
            <span style="letter-spacing:${_opt.spacing}px">★★★★★</span>
        </div>
    `);

    var clWidth = $(this).width();
    var percent = clWidth * 0.01 * _opt.value - _opt.spacing / 2;
    $(this).find('.fill-ratings').css({'width': `${percent}px`});

    $(this).find('.fill-ratings').resize(function() {
        opt.onChange();
    });
}

$('.star-ratings').__proto__.setvalue = function(value) {
    var clWidth = $(this).width();
    var percent = clWidth * 0.01 * value - parseInt($(this).css('padding-left')) / 2;
    $(this).find('.fill-ratings').css({'width': `${percent}px`});
}