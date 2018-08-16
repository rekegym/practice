/**
 * High & Low
 */

//moment.jsをセット
moment.locale('ja');

// ==========================================================================
// 変数
// ==========================================================================
//ボタン
var $btn = {
    start : $('#btn-start'),
    highlow : $('.p-highlow__btn'),
    high : $('#btn-high'),
    low : $('#btn-low')
}
//出力先
var $output = {
    result : $('#highlow-result'),
    win : $('#highlow-win'),
    log : $('#highlow-log')
}
//カード
var $card = {
    current : $('#card-current'),
    compare : $('#card-compare')
}
//番号
var num = {
    current : 0,
    compare : 0,
    balance : 0
}
//引いたカード
var draw = {
    num : '',
    card : '',
    order : ''
}
//画像URL
var imgSrc = 'img/trump/';
var imgBackSrc = 'img/trump/back.png';
//ストック
var stock = [];
//連勝数
var winNum = 0;


// ==========================================================================
// Event
// ==========================================================================
//Start & Resetボタンを押したとき
$btn.start.on('click',function(){
    //カードストックを初期化
    funcCardSet();
    if( winNum > 0 ){
        //ログを出力
        $output.log.children('ul').prepend( funcOutputLog( winNum ) );
        //連勝数を初期化
        winNum = 0;
        $output.win.text(winNum);
    }
    //判定を初期化
    $output.result.text('');
    //カードをめくる
    funcDrawCard();
    $card.current
        .attr('src', imgSrc + draw.card + '.png')
        .data('card-num', draw.num );
    //カードを伏せる
    $card.compare.attr('src', imgBackSrc );
    //ボタンを有効化
    $btn.high.prop('disabled', false);
    $btn.low.prop('disabled', false);
});

//High・Lowボタンを押したとき
$btn.highlow.on('click',function(){
    //カードをめくる
    funcDrawCard();
    $card.compare.attr('src', imgSrc + draw.card + '.png');
    $card.compare.data('card-num', draw.num );
    //比較判定
    var result = funcCardCompare();
    switch(result){
        case $(this).text():
            $output.result.text('的中！');
            //連勝数をカウント
            winNum = winNum + 1;
            //ストックの残数を確認
            if(stock.length === 0){
                alert('カードストックが空になりました！');
                $btn.start.click();
            }
            //カードをスライド
            funcSlideCard();
            break;
        case 'Draw':
            $output.result.text('ドロー');
            //ストックの残数を確認
            if(!stock.length){
                alert('カードストックが空になりました！');
                $btn.start.click();
            }
            //カードをスライド
            funcSlideCard();
            break;
        default:
            $output.result.text('ハズレ');
            //ログを出力
            $output.log.children('ul').prepend( funcOutputLog( winNum ) );
            //連勝数を初期化
            winNum = 0;
            break;
    }
    $output.win.text(winNum);
});


// ==========================================================================
// Function
// ==========================================================================
//カードストックを初期化
function funcCardSet(){
    stock = [];
    for ( var i = 1 ; i <= 13 ; i++ ){
        stock.push('s' + i);
        stock.push('h' + i);
        stock.push('c' + i);
        stock.push('d' + i);
    }
    return;
}

//カードをめくる
function funcDrawCard(){
    //ボタンを無効化
    $btn.high.prop('disabled', true);
    $btn.low.prop('disabled', true);
    //ランダムで配列を指定
    max = stock.length;
    draw.order = Math.floor( Math.random() * max );
    //ストックから引き出す
    draw.card = stock[ draw.order ];
    draw.num = draw.card.substr(1);
    //引き出したカードをストックから抜く
    stock.splice( draw.order, 1 );
    return;
}

//比較判定
function funcCardCompare(){
    //カードの番号を取得
    num.current = $card.current.data('card-num');
    num.compare = $card.compare.data('card-num');
    num.balance = num.current - num.compare;
    if( num.balance > 0 ){
        return 'Low';
    } else if( num.balance === 0 ){
        return 'Draw';
    } else{
        return 'High';
    }
}

//カードのスライド
function funcSlideCard(){
    setTimeout( function(){
        //compareからcurrentに受け渡し
        $card.current
            .attr('src', imgSrc + draw.card + '.png')
            .data('card-num', num.compare);
        //ボタンを有効化
        $btn.high.prop('disabled', false);
        $btn.low.prop('disabled', false);
        //カードを伏せる
        $card.compare.attr('src', imgBackSrc );
    }, 700 );
    return;
}

//ログ出力
function funcOutputLog( num ){
    var html = '';
    html = '<li class="row pb-1"><div class="col">' +
        moment().format('YYYY/MM/DD HH:mm:ss') + 
        '</div><div class="col text-right">' +
        num +
        ' 勝</div></li>';
    return html;
}