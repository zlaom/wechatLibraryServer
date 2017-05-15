/**
 * Created by 14798 on 2017/5/15.
 */
var Message = require('../../models/messages');
var Book = require('../../models/books');
var BookStatus = require('../../models/bookStatus');
var moment = require('moment');

module.exports = {
    // 提前提醒还书
    borrowRemind: function Arrears(ago, canBorrowTime) {
        var DayAgo = moment().subtract(ago, 'days').toDate();
        var lastDayAgo = moment().subtract(canBorrowTime, 'days').toDate();
        var type = "borrow";

        BookStatus.getBookStatusByStartEnd(lastDayAgo, DayAgo, type).then(function (obj) {
            for (var i = 0; i < obj.length; i++) {
                (function (obj) {
                    var message = {
                        userId: '',
                        author: '',
                        messageData: ''
                    };
                    var userId = obj.userId;
                    var borrowTime = obj.createTime;
                    var jetLag = moment(borrowTime).diff(moment(lastDayAgo), 'days');// 时差

                    message.userId = userId;
                    message.author = '图书馆';

                    Book.getBookByBookId(obj.bookId).then(function (obj) {
                        var bookTitle = obj.bookTitle;

                        message.messageData = '您借的《' + bookTitle + '》还有' + jetLag + '天到期，请及时归还！';
                        console.log(message);
                        Message.create(message);
                    })
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
                (function (obj) {
                    var message = {
                        userId: '',
                        author: '',
                        messageData: ''
                    };
                    var userId = obj.userId;
                    var borrowTime = obj.createTime;
                    var jetLag = moment(DayAgo).diff(moment(borrowTime), 'days');// 时差

                    if (jetLag != 0) {
                        message.userId = userId;
                        message.author = '图书馆';

                        Book.getBookByBookId(obj.bookId).then(function (obj) {
                            var bookTitle = obj.bookTitle;

                            message.messageData = '您借的《' + bookTitle + '》已经超期' + jetLag + '天，请尽快归还！超期将会影响你的信誉度！';
                            console.log(message);
                            Message.create(message);
                        })
                    }
                })(obj[i], i);
            }
        });
    }
};