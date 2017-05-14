/**
 * Created by 14798 on 2017/4/15.
 */
var express = require('express');
var router = express.Router();
var BookModel = require('../models/books');// 书籍模型
var BookStatusModel = require('../models/bookStatus');// 书籍状态模型
var MessageModel = require('../models/messages');// 消息模型
var moment = require('moment');
// 书籍详情页面
router.get('/bookDetail', function (req, res, next) {
    var userId = req.query.userId;
    var bookId = req.query.bookId;
    var data = {
        book: '',
        relatedBooks: '',
        bookStatus: ''
    };
    //获得一本书
    BookModel.getBookByBookId(bookId).then(function (book) {
        var Sorts = book.bookSorts;
        var BookId = book.bookId;
        book.bookCover = 'http://localhost:3000/img/' + book.bookCover;
        var sorts = "";
        for (var i = 0; i < book.bookSorts.length; i++) {
            var sort = book.bookSorts[i];
            switch (sort) {
                case 'e':
                    sort = '英语';
                    break;
                case 'c':
                    sort = '计算机';
                    break;
                case 's':
                    sort = '科学';
                    break;
                case 'h':
                    sort = '历史';
                    break;
                case 'l':
                    sort = '文化';
                    break;
                default:
                    break;
            }
            sorts = sort + ' ' + sorts;
        }
        book.bookSorts = sorts;
        data.book = book;
        //获得一本书的推荐书籍
        BookModel.getRelaBooksByBookId(Sorts, BookId).then(function (book1) {
            console.log(book1);
            var relatedBooks = [];
            for (var i = 0; i < book1.length; i++) {
                relatedBooks[i] = {
                    bookId: book1[i].bookId,
                    bookTitle: book1[i].bookTitle,
                    bookCover: 'http://localhost:3000/img/' + book1[i].bookCover
                };
            }
            console.log(relatedBooks);
            data.relatedBooks = relatedBooks;
            // 获取是否已经预约
            BookStatusModel.getBookStatusByUserIdBookId(userId, bookId, "reserve").then(function (obj) {
                if (!obj) {
                    // 获取是否已经借阅
                    BookStatusModel.getBookStatusByUserIdBookId(userId, bookId, "borrow").then(function (obj) {
                        if (!obj) {
                            data.bookStatus = "none";
                        } else {
                            data.bookStatus = "borrow";
                        }
                        res.send(data);
                    })
                } else {
                    data.bookStatus = "reserve";
                    res.send(data);
                }
            });
        })
    });
});

// 书籍预订操作
router.post('/bookReserve', function (req, res, next) {
    var userId = req.fields.userId;
    var bookId = req.fields.bookId;
    var author = "图书馆管理员";
    var type = "reserve";

    var bookStatus = {
        bookId: bookId,
        userId: userId,
        type: type,
        createTime:moment().toDate()
    };
    var message = {
        userId: '',
        author: '',
        messageData: ''
    };

    // 预约信息写入数据库
    BookStatusModel.bookStatus(bookStatus)
        .then(function (obj) {
            // 使书本可借数减一
            BookModel.bookCanUpdate(0, bookId);
            // 写入预约信息
            BookModel.getBookByBookId(bookId)
                .then(function (obj) {
                    message.userId = userId;
                    message.author = author;
                    message.messageData =  '您已经成功预约《' + obj.bookTitle + '》!';
                    //console.log(message);
                    MessageModel.create(message);

                    // 设置定时器提醒还书
                   /* setTimeout(function () {
                        var message = {
                            userId: userId,
                            author: author,
                            messageData: '您借的《' + obj.bookTitle + '》已到期! 请尽快还书！'
                        };
                        console.log(message);
                        MessageModel.create(message);
                    }, 300000);*/
                });
            res.send('success');//返回成功
        })
        .catch(function (err) {//错误判断
            console.log(err);
            res.send("预约失败！")
        });
});

// 取消预订操作
router.post('/cancelReserve', function (req, res, next) {
    var userId = req.fields.userId;
    var bookId = req.fields.bookId;
    var author = "图书馆管理员";
    var type = "reserve";

    var message = {
        userId: '',
        author: '',
        messageData: ''
    };

    // 删除预约信息
    BookStatusModel.delBookStatus(userId, bookId, type)
        .then(function (obj) {
            if (!obj.result.n) {//result.n为1表示有这个记录
                res.send("取消失败！未找到相关记录。");
            } else {
                // 使书本可借数加一
                BookModel.bookCanUpdate(1, bookId);
                // 写入取消预约消息
                BookModel.getBookByBookId(bookId)
                    .then(function (obj) {
                        message.userId = userId;
                        message.author = author;
                        message.messageData = '您已经成功取消预约《' + obj.bookTitle + '》!';
                        MessageModel.create(message);
                    });
                res.send('success');//返回成功
            }
        })
        .catch(function (err) {//错误判断
            res.send("取消失败！");
        });
});

// 得到一个分类
router.get('/sortDetail', function (req, res, next) {
    var sort = req.query.bookSort;
    BookModel.getBooksByBookSort(sort).then(function (obj) {
        if (!obj) {
            console.log('查找:' + query + ',未找到结果!');
        } else {
            var books = [];
            for (var i = 0; i < obj.length; i++) {
                books[i] = {
                    bookId: obj[i].bookId,
                    cover: 'http://localhost:3000/img/' + obj[i].bookCover,
                    bookName: obj[i].bookTitle,
                    bookAbstract: obj[i].bookAbstract,
                    bookNum: obj[i].bookNum,
                    canBorrow: obj[i].bookCan
                };
            }
            console.log(books);
            res.send(books);
        }
    })
});

module.exports = router;

