/**
 * Created by 14798 on 2017/5/12.
 * 还书提醒
 */
var pFunction = require('./publicFunction');
var websocket = require('./webSocket');//websocket

module.exports = {
    remind:function remind(){
        var days = 1; // 设置扫描时间间隔天数
        var interval = 1000;/*days*24*60*60*1000;*/
        var userId ="vtrust";
        var message=0;
// 按时间按间隔检测借书数据并提醒还书
        setInterval(function () {/*
         // 提前7天的还书提醒
         pFunction.borrowRemind(23,30);

         // 超期30天拖欠提醒
         pFunction.borrowArrears(30);*/

           /* websocket.sendUseMsg(userId,message++);*/
           /* websocket.sendUseMsg('pancake',message++);*/
        }, interval);
    }
};

