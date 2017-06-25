/**
 * Created by 14798 on 2017/6/23.
 */
/**
 * Created by 14798 on 2017/4/15.
 */
var fs = require('fs');
var path = require('path');
var express = require('express');
var moment = require('moment');
var router = express.Router();
var BookModel = require('../models/books');// 书籍模型
var BookStatusModel = require('../models/bookStatus');// 书籍状态模型
var SortModel = require('../models/sorts');// 类型模型
var checkLogin = require('../middlewares/check').checkLogin;
// 获得所有书籍
router.get('/', function (req, res, next) {
    BookModel.getBooks().then(function (books) {
        res.render('books', {
            books: books
        });
    }).catch(next);
});

// GET /books/:bookId/remove 删除一篇文章
router.get('/:bookId/remove', checkLogin, function(req, res, next) {
    var bookId = req.params.bookId;
    console.log(bookId);
    BookModel.delBookById(bookId)
        .then(function () {
            req.flash('success', '删除书籍成功');
            // 删除成功后跳转到书籍管理
            res.redirect('/books');
        })
        .catch(next);
});

// GET /books/:bookId/edit 更新书本页面
router.get('/:bookId/bookEdit', checkLogin, function(req, res, next) {
    var bookId = req.params.bookId;

    BookModel.getBookByBookId(bookId)
        .then(function (book) {
            if (!book) {
                throw new Error('该书本不存在');
            }
            res.render('bookEdit', {
                book: book
            });
        })
        .catch(next);
});
// POST /books/:bookId/bookEdit 更新一本书
router.post('/:bookId/bookEdit', checkLogin, function(req, res, next) {
    // 获取变量值
    var bookId = req.fields.bookId;
    var bookTitle = req.fields.bookTitle;
    var bookAuthor = req.fields.bookAuthor;
    var bookPress = req.fields.bookPress;
    var bookNum = req.fields.bookNum;
    var bookAbstract = req.fields.bookAbstract;
    var bookSorts = [];
    var bookCan = bookNum;
    var bookBowNum = '0';
    if(req.files.bookCover.size>0){
        var bookCover = req.files.bookCover.path.split(path.sep).pop();
    }

    // 根据checkbox判断并写入bookSorts
    var i = 0;
    var bookNum = req.fields.bookNum;
    var bookSort1 = req.fields.bookSort1;
    var bookSort2 = req.fields.bookSort2;
    var bookSort3 = req.fields.bookSort3;
    if (bookSort1) {
        bookSorts[i] = bookSort1;
        console.log(SortModel.getSortByBookSort(bookSort1));
        for (var j = 0; j < bookNum; j++)
            SortModel.updateSortBkNumBySortEname(bookSort1);
        i++;
    }
    if (bookSort2) {
        bookSorts[i] = bookSort2;
        console.log(SortModel.getSortByBookSort(bookSort2));
        for (var j = 0; j < bookNum; j++)
            SortModel.updateSortBkNumBySortEname(bookSort2);
        i++;
    }
    if (bookSort3) {
        bookSorts[i] = bookSort3;
        console.log(SortModel.getSortByBookSort(bookSort3));
        for (var j = 0; j < bookNum; j++)
            SortModel.updateSortBkNumBySortEname(bookSort3);
        i++;
    }

    //模板赋值
    var book = {
        bookId: bookId,
        bookTitle: bookTitle,
        bookAuthor: bookAuthor,
        bookPress: bookPress,
        bookSorts: bookSorts,
        bookAbstract: bookAbstract,
        bookNum: parseInt(bookNum),
        bookCan: parseInt(bookCan),
        bookBowNum: parseInt(bookBowNum)
    };
    if(bookCover){
        console.log('增加');
        book.bookCover=bookCover;
    }
    BookModel.updateBookById(bookId, book)
        .then(function () {
            console.log("成功");
            req.flash('success', '编辑书本成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/books/${bookId}/bookEdit`);
        })
        .catch(next);
});

// 单本书籍
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
                    console.log(obj);
                    data.bookStatus = "reserve";
                    data.statusId = obj._id;
                    console.log(data);
                    res.send(data);
                }
            });
        })
    });
});

module.exports = router;

