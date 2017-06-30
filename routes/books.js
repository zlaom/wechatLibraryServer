/**
 * Created by 14798 on 2017/4/15.
 * 关于书籍操作的路由
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

//GET /books 管理员端获得所有书籍
router.get('/', checkLogin, function (req, res, next) {
    BookModel.getBooks().then(function (books) {
        res.render('books', {
            books: books
        });
    }).catch(next);
});

// GET /books/:bookId/remove 删除一本书
router.get('/:bookId/remove', checkLogin, function (req, res, next) {
    var bookId = req.params.bookId;

    BookModel.delBookById(bookId)
        .then(function () {
            req.flash('success', '删除书籍成功');
            // 删除成功后跳转到书籍管理
            res.redirect('/books');
        })
        .catch(next);
});

// GET /books/:bookId/edit 更新书本页面
router.get('/:bookId/edit', checkLogin, function (req, res, next) {
    var bookId = req.params.bookId;

    BookModel.getBookByBookId(bookId)
        .then(function (book) {
            if (!book) {
                throw new Error('该书本不存在');
            }
            SortModel.showSorts().then(function (sorts) {
                res.render('bookEdit', {
                    book: book,
                    sorts: sorts
                });
            })
        })
        .catch(next);
});

// POST /books/:bookId/edit 更新一本书
router.post('/:bookId/edit', checkLogin, function (req, res, next) {
    // 获取变量值
    var id=req.params.bookId;
    var bookId = req.fields.bookId;
    var bookTitle = req.fields.bookTitle;
    var bookAuthor = req.fields.bookAuthor;
    var bookPress = req.fields.bookPress;
    var bookNum = req.fields.bookNum;
    var bookAbstract = req.fields.bookAbstract;
    var bookSorts = [];
    var bookBowNum = req.fields.bookBowNum;
    if (req.files.bookCover.size > 0) {
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
        for (var j = 0; j < bookNum; j++)
            SortModel.updateSortBkNumBySortEname(bookSort1);
        i++;
    }
    if (bookSort2 && bookSort2 != bookSort1) {
        bookSorts[i] = bookSort2;
        for (var j = 0; j < bookNum; j++)
            SortModel.updateSortBkNumBySortEname(bookSort2);
        i++;
    }
    if (bookSort3 && bookSort3 != bookSort1) {
        if (bookSort3 != bookSort2) {
            bookSorts[i] = bookSort3;
            for (var j = 0; j < bookNum; j++)
                SortModel.updateSortBkNumBySortEname(bookSort3);
            i++;
        }

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
        bookBowNum: parseInt(bookBowNum)
    };
    // 重新设置了封面
    if (bookCover) {
        book.bookCover = bookCover;
    }
    BookModel.updateBookById(id, book)
        .then(function () {
            req.flash('success', '编辑书本成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/books/${id}/edit`);
        })
        .catch(function (e) {
            fs.unlink(req.files.bookCover.path);
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '条形码已被占用');
                return res.redirect(`/books/${id}/edit`);
            }
            next(e);
        });
});

// 搜索功能
router.get('/search', function (req, res, next) {
    var queryTitle = {};
    queryTitle['bookTitle'] = new RegExp(req.query.content);
    BookModel.getBookBySearch(queryTitle).then(function (books) {
        if (!books.length) {
            var queryAuthor = {};
            queryAuthor['bookAuthor'] = new RegExp(req.query.content);
            BookModel.getBookBySearch(queryAuthor).then(function (books) {
                if (!books.length) {
                    res.render('books', {
                        books: ''
                    });
                } else {
                    res.render('books', {
                        books: books
                    });
                }
            });
        } else {
            res.render('books', {
                books: books
            });
        }
    })
});
module.exports = router;

