/**
 * Created by 14798 on 2017/5/12.
 */
var pFunction = require('./publicFunction');

var interval = 1000;// 设置扫描时间间隔

// 按时间按间隔检测借书数据并提醒还书
setInterval(function () {
    // 提前两天的还书提醒
    pFunction.borrowRemind(27,30);

    // 超期30天拖欠提醒
    pFunction.borrowArrears(30);
}, interval);

