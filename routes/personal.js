/**
 * Created by 14798 on 2017/5/8.
 */
/**
 * Created by Damian on 2017/4/20.
 */
var express = require('express');
var router = express.Router();
var User = require('../models/users');
var Book = require('../models/books');
var Message = require('../models/messages');
var BookStatus = require('../models/bookStatus');
var Sort = require('../models/sorts');
var moment = require('moment');
var config = require('config-lite');


router.get('/', function (req, res, next) {// 获得个人主页需要的数据
    var userId = req.query.userId;//传入的用户名
    var data = {//返回数据的结构
        'borrowBook': [],
        'reserveBook': [],
        'recommendBook': [],
        'remind': 0
    };

    BookStatus.findOneTypeByUserId(userId, 'borrow').then(function (bBooks) {//找到该预约书的状态
        BookStatus.findOneTypeByUserId(userId, 'reserve').then(function (rBooks) {// 找到该用户借的状态
            BookStatus.findOneTypeByUserId(userId, 'recommend').then(function (cBooks) {// 找到该用户借的状态
                Message.getMessagesByUserId(userId).then(function (messages) {// 获取消息数量
                    for (var i = 0; i < bBooks.length; i++) {// 获得已借书的信息
                        var oneBook1 = {
                            bookId: bBooks[i].bookId,
                            bookTitle: bBooks[i].bookTitle,
                            bookCover: bBooks[i].bookCover,
                            resources: bBooks[i].resources,
                            returnTime: moment(bBooks[i].returnTime).format('M') + '月' + moment(bBooks[i].returnTime).format('D') + '日'
                        };
                        data.borrowBook.push(oneBook1);
                    }
                    for (var i = 0; i < rBooks.length; i++) {// 获得预约的信息
                        var oneBook2 = {
                            bookId: rBooks[i].bookId,
                            bookTitle: rBooks[i].bookTitle,
                            bookCover: rBooks[i].bookCover,
                            resources: rBooks[i].resources,
                            returnTime: moment(rBooks[i].returnTime).format('M') + '月' + moment(rBooks[i].returnTime).format('D') + '日'
                        };
                        console.log(moment(rBooks[i].returnTime).format('M,d'));
                        console.log(moment().format('M,d'));
                        data.reserveBook.push(oneBook2);
                    }
                    for (var i = 0; i < cBooks.length; i++) { //推荐书籍
                        var oneBook3 = {
                            bookId: cBooks[i].bookId,
                            bookTitle: cBooks[i].bookTitle,
                            bookCover: cBooks[i].bookCover,
                            resources: cBooks[i].resources
                        };
                        data.recommendBook.push(oneBook3);
                    }

                    data.remind = messages.length;
                    console.log(data);
                    return res.send(data);
                })
            })
        });
    });
});
// 获得用户详情数据
/**
 * Created by Damian on 2017/5/5.
 */
router.get('/personDetail', function (req, res, next) {
    var userId = req.query.userId;
    /*    var query={
     userId:userId
     };*/
    User.getUserById(userId).then(function (obj) {
        obj = {
            phone: obj.phone,
            idCard: obj.idCard
        };
        res.send(obj);
    })
});
// 获得消息数据
router.get('/messages', function (req, res, next) {
    var userId = req.query.userId;
    Message.getMessagesByUserId(userId)
        .then(function (obj) {
            for (var i = 0; i < obj.length; i++) {
                obj[i].ifShow = 1;
            }
            data = {
                messagesNum: obj.length,
                messages: obj
            };
            /*var test = moment().format("x");
             console.log(objectIdToTimestamp(obj[0]._id));
             console.log(objectIdToTimestamp(obj[1]._id));
             console.log(test-objectIdToTimestamp(obj[1]._id));
             var time = moment(objectIdToTimestamp(obj[1]._id),"M").fromNow();
             console.log(time);
             console.log("m");
             console.log(test);
             //console.log(data);*/
            res.send(data);
        })
});
// 删除一条消息
router.post('/delMessage', function (req, res, next) {
    var userId = req.fields.userId;
    var messageId = req.fields.messageId;
    Message.delMessagesByUserMessageId(userId, messageId).then(function (obj) {
        res.send('success');
    });
});
// 通过用户Id删除所有消息
router.post('/delAllNews', function (req, res, next) {
    var userId = req.fields.userId;
    Message.delAllMessagesByUserMessageId(userId).then(function (obj) {
        res.send('success');
    });
});

module.exports = router;