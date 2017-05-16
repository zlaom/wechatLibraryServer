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
var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 获得应用详情页数据
router.get('/', function (req, res, next) {
    var userId = req.query.userId;
    console.log("ok"+userId);
    var borrowBook = [];
    var reserveBook = [];
    //var recommendBook = [];
    var flag0 = 0;
    var flag1 = 0;
    //var flag2 = 0;
    var data = {
        'borrowBook': [],
        'reserveBook': [],
        'recommendBook': []
    };

    // 获得预约的书
    BookStatus.getUserReserveBook(userId)
        .then(function (obj) {
            console.log("nide");
            console.log(obj.length);
            if (!obj.length) {
                console.log('查找 reserve,未找到结果!');
                flag0 = -1;
            } else {
                console.log("nide");
                for (var i = 0; i < obj.length; i++) {
                    Book.getBookByBookId(obj[i].bookId)
                        .then(function (book) {
                            reserveBook.push(book);
                            flag0++;
                            if (flag0 == obj.length) {
                                for (var j = 0; j < reserveBook.length; j++) {
                                    reserveBook[j] = {
                                        bookId: reserveBook[j].bookId,
                                        bookTitle: reserveBook[j].bookTitle,
                                        bookCover: 'http://localhost:3000/img/' + reserveBook[j].bookCover
                                    };
                                }
                                data.reserveBook = reserveBook;
                                flag0 = -1;
                                if (flag0 == -1 && flag1 == -1) {
                                    console.log(data);
                                    res.send(data);
                                }
                            }
                        });
                }
            }
        });
    BookStatus.getUserBorrowBook(userId)
        .then(function (obj) {
            if (!obj.length) {
                console.log('查找borrow,未找到结果!');
                flag1 == -1;
            } else {
                for (var i = 0; i < obj.length; i++) {
                    Book.getBookByBookId(obj[i].bookId)
                        .then(function (book) {
                            borrowBook.push(book);
                            flag1++;
                            if (flag1 == obj.length) {
                                for (var j = 0; j < borrowBook.length; j++) {
                                    borrowBook[j] = {
                                        bookId: borrowBook[j].bookId,
                                        bookTitle: borrowBook[j].bookTitle,
                                        bookCover: 'http://localhost:3000/img/' + borrowBook[j].bookCover
                                    };
                                }
                                data.borrowBook = borrowBook;
                                flag1 = -1;
                                if (flag0 == -1 && flag1 == -1) {
                                    console.log(data);
                                    res.send(data);
                                }
                            }
                        });
                }
            }
        });
    // Book.getUserRecommendBook(userId)
    //     .then(function (obj) {
    //         if (!obj) {
    //             console.log('查找:' + query + ' ,未找到结果!');
    //         } else {
    //             for (var i = 0; i < obj.length; i++) {
    //                 Book.getBookByBookId(obj[i].bookId)
    //                     .then(function (book) {
    //                         recommendBook.push(book);
    //                         flag2++;
    //                         if (flag2 == 3) {
    //                             data.reserveBook = recommendBook;
    //                             if (flag0 == 3 && flag1 == 3 && flag2 == 3) {
    //                                 res.send(data);
    //                             }
    //                         }
    //                     });
    //             }
    //         }
    //     });
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

module.exports = router;