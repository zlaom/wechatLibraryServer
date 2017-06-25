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

var objectIdToTimestamp = require('objectid-to-timestamp');
var compare = function (x, y) {//比较函数
    if (x < y) {
        return 1;
    } else if (x > y) {
        return -1;
    } else {
        return 0;
    }
}


// 获得应用详情页数据
router.get('/', function (req, res, next) {
    var userId = req.query.userId;//传入的用户名
    console.log("ok " + userId);
    var borrowBook = [];
    var reserveBook = [];
    var returnedBook = [];
    var recommendBook = [];

    var bookSorts = [];
    var flag = [0, 0, 0, 0];//flag分别为reserve,borrow,recommend,remind,当值为-1时，表示已读取数据完毕
    var count = 0;
    var maxRecommendSort = config.defaultRecommendSorts;//可在config中修改默认推荐的值
    var data = {
        'borrowBook': [],
        'reserveBook': [],
        'recommendBook': [],
        'remind': 0
    };

    // 获得预约的书
    BookStatus.getUserReserveBook(userId)
        .then(function (obj) {
            // console.log(obj.length);//查找结果长度
            if (!obj.length) {

                console.log('查找 reserve,未找到结果!');

                flag[0] = -1;//reserve标记置-1

                //console.log('flag[0]=' + flag[0] + '\nflag[1]=' + flag[1]);
                //可在此处检验标记

                if (flag[0] == -1 && flag[1] == -1 && flag[2] == -1 && flag[3] == -1) {
                    //当标记全为-1即所有数据读取完成时发送data
                    // console.log(data);//最终发送data
                    console.log('send data:\nreserve:' + data.reserveBook.length + '\nborrow:' + data.borrowBook.length +
                        '\nrecommend:' + data.recommendBook.length + '\nremind:' + data.remind);
                    res.send(data);
                }

            } else {//当查找结果不为空时
                // console.log(obj);//输出查找结果
                for (var i = 0; i < obj.length; i++) {

                    Book.getBookByBookId(obj[i].bookId)//根据bookid查找对应book
                        .then(function (book) {

                            reserveBook.push(book);//装进reserveBook临时数组

                            if (reserveBook.length == obj.length) {//查找完毕，改造json结构

                                for (var j = 0; j < reserveBook.length; j++) {

                                    reserveBook[j] = {
                                        bookId: reserveBook[j].bookId,
                                        bookTitle: reserveBook[j].bookTitle,
                                        bookCover: reserveBook[j].bookCover
                                    };

                                }

                                data.reserveBook = reserveBook;//设置data

                                flag[0] = -1;//标记置-1

                                // console.log('flag[0]=' + flag[0] + '\nflag[1]=' + flag[1]);

                                if (flag[0] == -1 && flag[1] == -1 && flag[2] == -1 && flag[3] == -1) {
                                    //当标记全为-1即所有数据读取完成时发送data
                                    // console.log(data);//最终发送data
                                    console.log('send data:\nreserve:' + data.reserveBook.length + '\nborrow:' + data.borrowBook.length +
                                        '\nrecommend:' + data.recommendBook.length + '\nremind:' + data.remind);
                                    res.send(data);
                                }
                            }
                        });
                }
            }
        });
    /*获取borrow的书*/
    BookStatus.getUserBorrowBook(userId)
        .then(function (obj) {
            // console.log(obj.length);//查找结果长度
            if (!obj.length) {
                console.log('查找borrow,未找到结果!');
                flag[1] = -1;//标记置-1
                // console.log('flag[0]=' + flag[0] + '\nflag[1]=' + flag[1]);
                //可在此处检验标记
                if (flag[0] == -1 && flag[1] == -1 && flag[2] == -1 && flag[3] == -1) {
                    //当标记全为-1即所有数据读取完成时发送data
                    // console.log(data);
                    console.log('send data:\nreserve:' + data.reserveBook.length + '\nborrow:' + data.borrowBook.length +
                        '\nrecommend:' + data.recommendBook.length + '\nremind:' + data.remind);
                    res.send(data);
                }
            } else {//当查找结果不为空时
                for (var i = 0; i < obj.length; i++) {
                    Book.getBookByBookId(obj[i].bookId)//根据bookid查找对应book
                        .then(function (book) {
                            borrowBook.push(book);//装进borrowBook临时数组
                            if (borrowBook.length == obj.length) {//查找完毕，改造json结构
                                for (var j = 0; j < borrowBook.length; j++) {
                                    borrowBook[j] = {
                                        bookId: borrowBook[j].bookId,
                                        bookTitle: borrowBook[j].bookTitle,
                                        bookCover: borrowBook[j].bookCover
                                    };
                                }
                                data.borrowBook = borrowBook;//设置data
                                flag[1] = -1;//标记置-1
                                // console.log('flag[0]=' + flag[0] + '\nflag[1]=' + flag[1]);
                                //可在此处检验标记
                                if (flag[0] == -1 && flag[1] == -1 && flag[2] == -1 && flag[3] == -1) {
                                    //当标记全为-1即所有数据读取完成时发送data
                                    // console.log(data);
                                    console.log('send data:\nreserve:' + data.reserveBook.length + '\nborrow:' + data.borrowBook.length +
                                        '\nrecommend:' + data.recommendBook.length + '\nremind:' + data.remind);
                                    res.send(data);
                                }
                            }
                        });
                }
            }
        });
    /*获取推荐书籍*/
    //先用borrow冒名顶替，滑稽
    BookStatus.getUserBorrowBook(userId)
        .then(function (obj) {
            if (!obj.length) {//如果没有returnedBook
                console.log('查找returned,未找到结果!');
                Book.getRecommendBooksByBookSort(maxRecommendSort)//使用默认推荐
                    .then(function (obj2) {
                        recommendBook = obj2;
                        for (var j = 0; j < recommendBook.length; j++) {//重构json
                            recommendBook[j] = {
                                bookId: recommendBook[j].bookId,
                                bookTitle: recommendBook[j].bookTitle,
                                bookCover: recommendBook[j].bookCover
                            };
                        }
                        data.recommendBook = recommendBook;//设置data
                        flag[2] = -1;//标记置-1
                        // console.log('flag[0]=' + flag[0] + '\nflag[1]=' + flag[1]);
                        //可在此处检验标记
                        if (flag[0] == -1 && flag[1] == -1 && flag[2] == -1 && flag[3] == -1) {
                            //当标记全为-1即所有数据读取完成时发送data
                            // console.log(data);
                            console.log('send data:\nreserve:' + data.reserveBook.length + '\nborrow:' + data.borrowBook.length +
                                '\nrecommend:' + data.recommendBook.length + '\nremind:' + data.remind);
                            res.send(data);
                        }
                    });
                /*从这往上都OK*/
            } else {//当查找结果不为空时
                maxRecommendSort=[];
                for (var i = 0; i < obj.length; i++) {
                    Book.getBookByBookId(obj[i].bookId)//根据bookid查找对应book
                        .then(function (book) {//统计各种分类借阅次数
                            var sorts = book.bookSorts;
                            for (y in sorts) {
                                if (!bookSorts[sorts[y]]) {
                                    bookSorts[sorts[y]] = 0;
                                }
                                bookSorts[sorts[y]]++;
                            }
                            count++;
                            if (count === obj.length) {//查找完毕，改造json结构
                                count=0;
                                /*从returnedBook中推算recommendBook*/

                                //打印所有历史借阅分类的权重
                                bookSorts.sort(compare);
                                // console.log(bookSorts);
                                //找到借阅次数前3的分类
                                for(z in bookSorts){
                                    maxRecommendSort.push(z);
                                    count++;
                                    if(count>=3){

                                        break;
                                    }
                                }
                                count=0;
                                Book.getRecommendBooksByBookSort(maxRecommendSort)//按分类查找书籍
                                    .then(function (obj1) {
                                        recommendBook = obj1;
                                        for (var j = 0; j < recommendBook.length; j++) {//重构json
                                            recommendBook[j] = {
                                                bookId: recommendBook[j].bookId,
                                                bookTitle: recommendBook[j].bookTitle,
                                                bookCover: recommendBook[j].bookCover
                                            };
                                        }
                                        data.recommendBook = recommendBook;//设置data*/
                                        flag[2] = -1;//标记置-1
                                        // console.log('flag[0]=' + flag[0] + '\nflag[1]=' + flag[1]);
                                        //可在此处检验标记
                                        if (flag[0] == -1 && flag[1] == -1 && flag[2] == -1 && flag[3] == -1) {
                                            //当标记全为-1即所有数据读取完成时发送data
                                            // console.log(data);
                                            console.log('send data:\nreserve:' + data.reserveBook.length + '\nborrow:' + data.borrowBook.length +
                                                '\nrecommend:' + data.recommendBook.length + '\nremind:' + data.remind);
                                            res.send(data);
                                        }
                                    });
                            }
                        });
                }
            }
        });
    /*获取用户消息数*/
    Message.getMessagesByUserId(userId)
        .then(function (obj) {
            data.remind = obj.length;
            flag[3] = -1;
            if (flag[0] == -1 && flag[1] == -1 && flag[2] == -1 && flag[3] == -1) {
                //当标记全为-1即所有数据读取完成时发送data
                // console.log(data);
                console.log('send data:\nreserve:' + data.reserveBook.length + '\nborrow:' + data.borrowBook.length +
                    '\nrecommend:' + data.recommendBook.length + '\nremind:' + data.remind);
                res.send(data);
            }
        })
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