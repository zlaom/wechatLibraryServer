/**
 * Created by 14798 on 2017/4/15.
 * 微信端图书馆
 */
var express = require('express');
var moment = require('moment');
var router = express.Router();
var BookModel = require('../models/books');// 书籍模型
var BookStatusModel = require('../models/bookStatus');// 书籍状态模型
var MessageModel = require('../models/messages');// 消息模型
var SortModel = require('../models/sorts');// 类型模型
var checkLogin = require('../middlewares/check').checkLogin;


//GET /library/Sorts 获得所有分类
router.get('/Sorts', function (req, res, next) {
    SortModel.showSorts().then(function (obj) {
        if (!obj) {
            console.log("error :" + error);
        } else {
            var sorts = [];
            for (var i = 0; i < obj.length; i++) {
                sorts[i] = {
                    sortCover: obj[i].sortCover,
                    sortName: obj[i].sortName,
                    num: obj[i].sortBkNum,
                    sortEname: obj[i].sortEname
                };
            }
            res.send(sorts);
            return next();

        }
    });
});

//GET /library/sortDetail 得到一个分类下的所有书籍
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
                    cover: obj[i].bookCover,
                    bookName: obj[i].bookTitle,
                    bookAuthor: obj[i].bookAuthor,
                    bookAbstract: obj[i].bookAbstract,
                    bookNum: obj[i].bookNum,
                    canBorrow: obj[i].bookCan
                };
            }
            res.send(books);
        }
    })
});

//GET /library/bookDetail 书籍详情页面
router.get('/bookDetail', function (req, res, next) {
    // 参数获取及初始化
    var userId = req.query.userId;
    var bookId = req.query.bookId;
    var data = {
        book: '',
        relatedBooks: '',
        bookStatus: '',
        statusId: 'null'
    };

    //获得一本书
    BookModel.getBookByBookId(bookId).then(function (book) {
        var Sorts = book.bookSorts;
        var BookId = book.bookId;
        var sorts = "";

        // 进行书籍分类匹配
        for (var i = 0; i < book.bookSorts.length; i++) {
            var sort = book.bookSorts[i];
            if(sort!='null'){
                sorts = sort + ' ' + sorts;
            }
        }
        book.bookSorts = sorts;

        data.book = book;

        //获得一本书的推荐书籍
        BookModel.getRelaBooksByBookId(Sorts, BookId).then(function (book1) {
            var relatedBooks = [];
            for (var i = 0; i < book1.length; i++) {
                relatedBooks[i] = {
                    bookId: book1[i].bookId,
                    bookTitle: book1[i].bookTitle,
                    bookCover: book1[i].bookCover
                };
            }
            data.relatedBooks = relatedBooks;
            // 判断当前书籍是否已经预约
            BookStatusModel.getBookStatusByUserIdBookIdType(userId, bookId, "reserve").then(function (obj) {
                if (!obj) {
                    // 不是预订书籍，开始判断当前书籍是否已经借阅
                    BookStatusModel.getBookStatusByUserIdBookIdType(userId, bookId, "borrow").then(function (obj) {
                        if (!obj) {
                            data.bookStatus = "none";
                        } else {
                            data.bookStatus = "borrow";
                            data.statusId = obj._id;
                        }
                        res.send(data);
                    })
                } else {
                    data.bookStatus = "reserve";
                    data.statusId = obj._id;
                    res.send(data);
                }
            });
        })
    });
});

//POST /library/bookReserve书籍预订操作
router.post('/bookReserve',function (req, res, next) {
    console.log(req.headers.session+"  ok");
    // 参数获取及初始化
    var userId = req.fields.userId;
    var bookId = req.fields.bookId;
    var author = "图书馆管理员";
    var type = "reserve";
    var bookTitle = '';

    var resData = {
        message: '',
        resources: 0,
        statusId: 'null'
    };

    var bookStatus = {
        bookId: bookId,
        userId: userId,
        type: type,
        resources: 0,
        createTime: moment().toDate()
    };
    var message = {
        userId: '',
        author: '',
        messageData: ''
    };

    // 找到相关书籍
    BookModel.getBookByBookId(bookId)
        .then(function (obj) {
            // 判断当前书籍是否还有可借数，有则给状态分配资源并把resources标志位置1
            if (obj.bookCan > 0) {
                bookStatus.resources = 1;
                resData.resources = 1;
            }
            bookTitle = obj.bookTitle;

            BookStatusModel.bookStatus(bookStatus)
                .then(function (obj) {
                    resData.statusId = obj.ops[0]._id; // 获取当前生成的bookstatus的_id
                    message.userId = userId;
                    message.author = author;
                    message.messageData = '您已经成功预约《' + bookTitle + '》!';
                    // 预约信息写入
                    MessageModel.create(message);
                    // 使书本可借数减一
                    if (resData.resources == 1) {
                        BookModel.bookCanCut(bookId);
                    }
                    resData.message = 'success';
                    res.send(resData);// 发送数据
                })
                .catch(function (err) {// 错误判断
                    resData.resources = 0;
                    resData.message = '预约失败！';
                    res.send(resData);// 发送数据
                });
        });
});

// POST /library/cancelReserve取消预订操作
router.post('/cancelReserve', function (req, res, next) {
    // 参数获取及初始化
    var userId = req.fields.userId;
    var bookId = req.fields.bookId;
    var author = "图书馆管理员";
    var type = "reserve";
    var resData = {
        message: '',
        resources: 0
    };

    var message = {
        userId: '',
        author: '',
        messageData: ''
    };

    // 找到相关书籍的预约状态
    BookStatusModel.getBookStatusByUserIdBookIdType(userId, bookId, type)
        .then(function (obj) {
            // 得到当前状态分配的资源数
            var resources = obj.resources;
            resData.resources = resources;
            // 更新预约信息为取消预约
            type = "cancelRe";
            BookStatusModel.updateStatusByUserBook(userId, bookId, type)
                .then(function (obj) {
                    // 判断是否存在相关记录
                    if (!obj.result.n) {//result.n为1表示有这个记录
                        res.send("取消失败！未找到相关记录。");
                    } else {
                        // 若当前状态持有资源则使书本可借数加一
                        if (resources == 1) {
                            BookModel.bookCanInc(bookId);
                            console.log("加一");
                        }

                        // 使此状态持有资源数清零
                        BookStatusModel.updateStatusResourcesByUserBookType(userId, bookId, type, 0);

                        // 先找到书本名字然后写入取消预约消息
                        BookModel.getBookByBookId(bookId)
                            .then(function (obj) {
                                message.userId = userId;
                                message.author = author;
                                message.messageData = '您已经成功取消预约《' + obj.bookTitle + '》!';
                                // 写入取消预约消息
                                MessageModel.create(message);
                            });
                        resData.message = 'success';
                        res.send(resData);//返回成功
                    }
                })
                .catch(function (err) {//错误判断
                    resData.message = '取消失败！';
                    res.send(resData);
                });
        });
});

// 借书操作


// 还书操作

module.exports = router;

