/**
 * Web Dice
 */

var $rollBtn = $('.p-webdice__btn');
var btnId = {
    submit : 'dice--submit',
    d100 : 'dice--d100',
    d66 : 'dice--d66',
    d99 : 'dice--d99'
}
var $outputLog = $('.p-webdice__log');
var $outputCurrent = {
    roll : $('#dice--current'),
    score : $('#dice--result'),
    array : $('#dice--array')
}
var diceCurrent = {
    score : '',
    array : []
}
moment.locale('ja');

$rollBtn.on('click', function(){
    var current = $(this).text();
    switch( $(this).attr('id') ){
        case btnId.d66:
            funcDiceRoll( 'concat', 2, 1, 6 );
            break;
        case btnId.d99:
            funcDiceRoll( 'concat', 2, 0, 9 );
            break;
        case btnId.d100:
            funcDiceRoll( 'concat', 2, 0, 9 );
            if( diceCurrent.score === 0 ){diceCurrent.score = 100;}
            break;
        case btnId.submit:
            //値を取得
            var diceValue = {
                number : $('#dice--number').val(),
                polyhedron : $('#dice--polyhedron').val()
            }
            if( diceValue.number < 1 ){
                alert('振る回数は1以上に指定してください');
            }
            console.log(diceValue);
            var current = diceValue.number + 'D' + diceValue.polyhedron;
            funcDiceRoll( 'add', diceValue.number, 1, diceValue.polyhedron );
            break;
    }
    //diceCurrentに反映
    $outputCurrent.roll.text( current );
    $outputCurrent.score.text( diceCurrent.score );
    $outputCurrent.array.text( diceCurrent.array );
    //ログを出力
    $outputLog.children('ul').prepend( funcOutputLog( diceCurrent.score, current, diceCurrent.array ) );
});



// ==========================================================================
// Function
// ==========================================================================

//ロール
function funcDiceRoll( type, num, min, max ){
    diceCurrent.score = '';
    diceCurrent.array = [];
    var dice;
    //指定の回数分ダイスロール
    for ( var i = 0 ; i < num ; i++ ){
        dice = Math.floor( Math.random() * ( max - min + 1 ) + min );
        diceCurrent.array.push(dice);
    }
    if( type == 'concat'){
        //配列を結合
        diceCurrent.score = diceCurrent.array.join('');
        diceCurrent.score = parseInt(diceCurrent.score);
    } else if( type == 'add' ){
        //配列を合計
        diceCurrent.score = diceCurrent.array.reduce(function(x, y) { return x + y; });
    }
    return diceCurrent;
}

//ログ出力
function funcOutputLog( score, roll, array ){
    var log = '';
    log = '' +
        '<li class="row py-1">\n    <div class="order-2 col-sm text-right font-weight-bold">' +
        score +
        '<br>\n<span class="small">' +
        array +
        '</span>\n</div>\n    <div class="order-1 col-sm">' +
        '<span class="small">' + moment().format('YYYY/MM/DD HH:mm') + '</span><br>\n' +
        roll + 
        '</div>\n</li>';
    return log;
}