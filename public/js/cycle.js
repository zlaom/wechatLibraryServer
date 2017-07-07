/**
 * Created by 14798 on 2017/5/12.
 * 还书提醒
 */
var pFunction = require('./publicFunction');

module.exports = {
    remind: function remind() {
        var days = 1; // 设置扫描时间间隔天数
        var interval = days*24*60*60*1000;
        // 按时间按间隔检测借书数据并提醒还书
        setInterval(function () {
            pFunction.CancelReserve();
            // 提前7天的还书提醒
            pFunction.borrowRemind(23, 30);

            // 超期30天拖欠提醒
            pFunction.borrowArrears(30);
            console.log('执行循环');
        }, interval);
    }
};

