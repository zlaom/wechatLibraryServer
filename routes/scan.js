/**
 * Created by hasee on 2017/6/30.
 */
var express = require('express');
var router = express.Router();
var BookStatus = require('../models/bookStatus');
var BookModel = require('../models/books');// 书籍模型
var MessageModel = require('../models/messages');// 消息模型
var websocket = require('../public/js/webSocket');//websocket
var moment = require('moment');


router.post('/', function (req, res, next) {
    var bookStatusId = req.fields.bookStatusId;//图书状态的id
    var actionMsg = {};//动作消息
    var errData = "";//错误返回消息
    var userId = '';//用户id
    var bookTitle = '';//书名
    var action = '';//操作


//管理员扫描二维码,返回借阅信息
    BookStatus.getBookStatusBy_id(bookStatusId).then(function (obj) {
        //找不到对应记录
        if (!obj) {
            errData = '操作失败！找不到对应记录!';
            res.send(errData);
            return;
        } else {
            //获取用户、书籍名称
            userId = obj.userId;
            bookTitle = obj.bookTitle;
            bookCover = obj.bookCover;

            if (obj.type == 'returned') {//图书已归还
                errData = '操作失败！图书已经被归还！';
                res.send(errData);
                return;
            } else if (obj.type == "borrow") {//还书
                action = '还书';
            } else if (obj.type == "reserve") {//借书
                action = '借书';
            }

            //构造返回数据

            actionMsg = {
                "userId": userId,
                "bookTitle": bookTitle,
                "action": action,
                "bookCover": bookCover
            };

            res.send(actionMsg);

        }

    })
});

router.post('/check', function (req, res, next) {
    var check = req.fields;//接收到的确认动作
    var bookStatusId = check.bookStatusId;//书本状态id
    var action = check.action;//操作
    var bookTitle = '';//书名
    var userId = '';//用户id
    var author = '管理员';//消息作者
    var messageData = '';//消息内容
    var msg = {};//消息
    var data = "";//返回信息
    BookStatus.getBookStatusBy_id(bookStatusId).then(function (obj) {

        bookTitle = obj.bookTitle;
        userId = obj.userId;
        bookId = obj.bookId;

        if (action == "borrow") {

            BookStatus.updateBookStatusBy_id(bookStatusId, "borrow");//更新状态

            messageData = "已成功借阅：《" + bookTitle + '》！';//创建消息内容

            data = "借书成功";//借书成功返回信息

            /**
             * websocket提示信息
             */
            websocket.sendUseMsg(author,userId,"borrow",0);

        } else if (action == "return") {

            BookStatus.updateBookStatusBy_id(bookStatusId, "returned");//更新状态

            BookStatus.findNextReserveUser(bookId).then(function (next) {

                var nextReserveUserStatus=next[0];

                if (!nextReserveUserStatus) {//如果没人预约，那么馆藏数+1
                    BookModel.bookCanInc(bookId);
                    console.log("没有人预约" + bookTitle);
                } else {
                    var n_statusId = nextReserveUserStatus._id;
                    var n_userId = nextReserveUserStatus.userId;
                    var status={
                        resources: 1,
                        updateTime:moment().toDate() ,
                        returnTime:moment().add(2,'days').toDate()
                    };
                    BookStatus.allUpDataByStatusId(n_statusId, status);//分配资源数、更新时间
                    var messageData_n='message_您预约的《' + bookTitle + '》到了，请及时领取';
                    websocket.sendUseMsg(author, n_userId,messageData_n,3);

                }
            });

            messageData = "已成功归还：《" + bookTitle + '》！';//创建消息内容

            data = '还书成功';//返回信息

            /**
             * websocket提示信息
             */
            websocket.sendUseMsg(author,userId,"return",0);
        }

        if (messageData != "") {//如果有消息，则创建
            //构造消息
            msg = {
                userId: userId,
                author: author,
                messageData: messageData
            };
            MessageModel.create(msg);//创建消息
        }

        res.send(data)
    });


});
module.exports = router;
