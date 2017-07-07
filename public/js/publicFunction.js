/**
 * Created by 14798 on 2017/5/15.
 */
var Message = require('../../models/messages');
var BookModel = require('../../models/books');
var BookStatus = require('../../models/bookStatus');
var moment = require('moment');
var websocket = require('./webSocket');//websocket

module.exports = {
    //取消超期预约记录
    CancelReserve: function CancelReserve() {
        var thisDate = moment().toDate();
        var yesDate=moment().subtract(1, 'days').toDate();
        var type = "reserve";
        BookStatus.getReturnBookStatusByStartEnd( yesDate,thisDate,type).then(function (haveResourceObj) {
            if (haveResourceObj.length>0){
                console.log('取消预订');
                console.log(haveResourceObj);
                haveResourceObj.forEach(function (oneObj) {
                    //先找想要这一本书的用户
                    console.log(oneObj);
                    BookStatus.findNextReserveUser(oneObj.bookId).then(function (oneUser) {
                        console.log('oneUser');
                        console.log(oneUser);
                        if (oneUser[0].userId) {
                            console.log('一个用户'+oneUser[0]);
                            var status={
                                resources: 1,
                                updateTime:moment().toDate() ,
                                returnTime:moment().add(2,'days').toDate()
                            };
                            BookStatus.allUpDataByStatusId(oneUser[0]._id, status);//分配资源数、更新时间
                            //消息即时提醒
                            var author = "管理员";
                            var message = "message_您预约的《" + oneUser[0].bookTitle + "》到啦！请即时到图书馆借阅。";

                            websocket.sendUseMsg(author, oneUser[0].userId, message, "3");
                        } else {
                            BookModel.bookCanInc(oneObj.bookId);//没人要书则增加可借数
                        }
                        //消除预约记录
                        BookStatus.delBookStatusByStatusId(oneObj._id);
                    })

                })
            }
        })
    },
    /*    //还书提醒
     borrowRemind:function borrowRemind(days) {
     var type="borrow";
     //var thisDate=moment().toDate();
     for (var i = 0; i < days; i++) {
     (function (i) {
     var thatDate=moment().add(i,'d').toDate();
     //开始查询
     BookStatus.
     })(i)
     }

     },*/
    // 提前提醒还书
    borrowRemind: function Arrears(ago, canBorrowTime) {
        var DayAgo = moment().subtract(ago, 'days').toDate();
        var lastDayAgo = moment().subtract(canBorrowTime, 'days').toDate();
        var type = "borrow";

        BookStatus.getBookStatusByStartEnd(lastDayAgo, DayAgo, type).then(function (obj) {
            for (var i = 0; i < obj.length; i++) {
                console.log('提醒还书');
                (function (obj) {
/*                    var message = {
                        userId: '',
                        author: '',
                        messageData: ''
                    };*/
                    var userId = obj.userId;
                    var borrowTime = obj.updateTime;
                    var jetLag = moment(borrowTime).diff(moment(lastDayAgo), 'days');// 时差

                    /*message.userId = userId;
                    message.author = '图书馆';*/
                    //消息即时提醒
                    var author = "管理员";
                    var message = "message_您借的《" + obj.bookTitle + "》还有"+ jetLag + '天到期，请及时归还！';
                    console.log('10'+userId);
                    websocket.sendUseMsg(author, userId, message, "3");
                   /* Book.getBookByBookId(obj.bookId).then(function (obj) {
                        var bookTitle = obj.bookTitle;

                        message.messageData = '您借的《' + bookTitle + '》还有' + jetLag + '天到期，请及时归还！';
                        websocket.sendUseMsg(userId, message.messageData);
                        console.log(message);
                        Message.create(message);
                    })*/
                })(obj[i], i);
            }
        });
    },

    // 超期还书提醒
    borrowArrears: function Arrears(canBorrowTime) {
        var DayAgo = moment().subtract(canBorrowTime, 'days').toDate();
        var type = "borrow";

        BookStatus.getBookStatusByEnd(DayAgo, type).then(function (obj) {
            for (var i = 0; i < obj.length; i++) {
                console.log('超期提醒');
                (function (obj) {
/*                    var message = {
                        userId: '',
                        author: '',
                        messageData: ''
                    };*/
                    var userId = obj.userId;
                    var borrowTime = obj.updateTime;
                    var jetLag = moment(DayAgo).diff(moment(borrowTime), 'days');// 时差

                    if (jetLag != 0) {
                        //消息即时提醒
                        var author = "管理员";
                        var message = "message_您借的《" + obj.bookTitle + "》已经超期"+ jetLag + "天，请尽快归还！超期将会影响你的信誉度！";
                        websocket.sendUseMsg(author, userId, message, "3");
                        console.log(author+" "+message+" "+userId);
/*                        message.userId = userId;
                        message.author = '图书馆';*/

/*                        Book.getBookByBookId(obj.bookId).then(function (obj) {
                            var bookTitle = obj.bookTitle;

                            message.messageData = '您借的《' + bookTitle + '》已经超期' + jetLag + '天，请尽快归还！超期将会影响你的信誉度！';
                            websocket.sendUseMsg(userId, message.messageData);
                            console.log(message);
                            Message.create(message);
                        })*/
                    }
                })(obj[i], i);
            }
        });
    }
};
