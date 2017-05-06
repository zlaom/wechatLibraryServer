/**
 * Created by 14798 on 2017/4/15.
 */
var express = require('express');
var router = express.Router();
var BookModel = require('../models/books');

// 书籍详情页面
router.get('/bookDetail', function (req, res, next) {
    /* '9787115230959'*/
    var bookId = req.query.bookId;
    var data;
    //获得一本书
    BookModel.getBookByBookId(bookId).then(function (book) {
        var Sorts = book.bookSorts;
        var BookId = book.bookId;
        book.bookCover = 'http://localhost:3000/img/' + book.bookCover;
        var sorts="";
        for (var i = 0; i < book.bookSorts.length; i++) {
            var sort=book.bookSorts[i];
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
            sorts=sort+' '+sorts;
        }
        book.bookSorts=sorts;
        //获得一本书的推荐书籍
        BookModel.getRelaBooksByBookId(Sorts,BookId).then(function (book1) {
            console.log(book1);
            var relatedBooks=[];
            for(var i=0;i<book1.length;i++){
                relatedBooks[i]={
                    bookId:book1[i].bookId,
                    bookTitle:book1[i].bookTitle,
                    bookCover:'http://localhost:3000/img/'+book1[i].bookCover
                };
            }
            console.log(relatedBooks);
            data={
                book:book,
                relatedBooks:relatedBooks
            };
            console.log(data);
            res.send(data);
        })
    });
});

// 书籍预订操作
router.post('/bookReserve', function (req, res, next) {
    var userId = "test";
    var bookId = req.fields.bookId;
    var type = "r";
    console.log(bookId);
    var bookStatus={
        bookId:bookId,
        userId : userId,
        type:type
    };

    //预约信息写入数据库
    BookModel.bookStatus(bookStatus)
        .then(function (result) {
            //使书本可借数减一
            BookModel.bookCanUpdate(0,bookId);
            res.send('success');//返回成功
        })
        .catch(function (err) {//错误判断
            res.send("预约失败！")
        });
});

// 取消预订操作
router.post('/cancelReserve', function (req, res, next) {
    var userId = "test";
    var bookId = req.fields.bookId;
    var type = "r";
    console.log(bookId);

    //预约信息写入数据库
    BookModel.delBookStatus(userId,bookId,type)
        .then(function (result) {
            //使书本可借数加一
            BookModel.bookCanUpdate(1,bookId);
            res.send('success');//返回成功
        })
        .catch(function (err) {//错误判断
            res.send("取消失败！")
        });
});

module.exports = router;

