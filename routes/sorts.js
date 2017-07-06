/**
 * Created by 14798 on 2017/6/23.
 * 分类管理
 */
var fs = require('fs');
var path = require('path');
var express = require('express');
var moment = require('moment');
var router = express.Router();
var SortModel = require('../models/sorts');// 分类模型
var BookModel = require('../models/books');//书籍模型
var tools=require('../public/js/tools');

var checkLogin = require('../middlewares/check').checkLogin;

// 获得所有分类
router.get('/', function (req, res, next) {
    SortModel.showSorts().then(function (sorts) {
        for(var i=0;i<sorts.length;i++){
            sorts[i].sortCover=tools.imgCahnge(sorts[i].sortCover);
        }
        res.render('sorts', {
            sorts: sorts
        });
    }).catch(next);
});

// GET /sorts/:sortId/edit 更新类别页面
router.get('/:sortId/edit', checkLogin, function (req, res, next) {
    var sortId = req.params.sortId;

    SortModel.getSortBySortId(sortId)
        .then(function (sort) {
            if (!sort) {
                throw new Error('该分类不存在');
            }
            BookModel.getBooksBySort(sort.sortName).then(function (books) {
                for(var i=0;i<books.length;i++){
                    books[i].sortId=sortId;
                    books[i].bookCover=tools.imgCahnge(books[i].bookCover);
                }

                res.render('sortEdit', {
                    sort: sort,
                    books: books
                });
            })

        })
        .catch(next);
});

// POST /sorts/:sortId/sortEdit 更新一个分类
router.post('/:sortId/edit', checkLogin, function (req, res, next) {
    // 获取变量值
    var sortId = req.params.sortId;
    var sortName = req.fields.sortName;
    var sortBkNum = req.fields.sortBkNum;
    if (req.files.sortCover.size > 0) {
        var sortCover = req.files.sortCover.path.split(path.sep).pop();
    }
    // 校验参数
    try {
        if (!sortName) {
            throw new Error('请填写分类名称');
        }
    } catch (e) {
        // 编辑失败
        req.flash('error', e.message);
        return res.redirect(`/sorts/${sortId}/edit`);
    }
    //模板赋值
    var sort = {
        sortName: sortName,
        sortBkNum: parseInt(sortBkNum)
    };
    if (sortCover) {
        console.log('增加');
        sort.sortCover = sortCover;
    }
    SortModel.updateSortById(sortId, sort)
        .then(function () {
            console.log("成功");
            req.flash('success', '编辑分类成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/sorts/${sortId}/edit`);
        })
        .catch(function (e) {
            // 用分类名称被占用则跳回分类注册页，而不是错误页
            fs.unlink(req.files.sortCover.path);
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '分类名已被占用');
                return res.redirect(`/sorts/${sortId}/edit`);
            }
            next(e);
        });
});


// GET /sorts/:sortId/remove 删除一个分类
router.get('/:sortId/remove', checkLogin, function (req, res, next) {
    var sortId = req.params.sortId;
    SortModel.delSortById(sortId)
        .then(function () {
            req.flash('success', '删除分类成功');
            // 删除成功后跳转到书籍管理
            res.redirect('/sorts');
        })
        .catch(next);
});

// GET /sort/book/:bookId/edit 更新分类书本页面
router.get('/:sortId/book/:bookId/edit', checkLogin, function (req, res, next) {
    var bookId = req.params.bookId;
    var sortId= req.params.sortId;

    BookModel.getBookByBookId(bookId)
        .then(function (book) {
            if (!book) {
                throw new Error('该书本不存在');
            }

            book.bookCover=tools.imgCahnge(book.bookCover);
            SortModel.showSorts().then(function (sorts) {
                res.render('sortBookEdit', {
                    sortId:sortId,
                    book: book,
                    sorts: sorts
                });
            })
        })
        .catch(next);
});

// POST /sorts/:sortId/book/:bookId/edit 更新一本书
router.post('/:sortId/book/:bookId/edit', checkLogin, function (req, res, next) {
    // 获取变量值
    var sortId=req.params.sortId;
    var id=req.params.bookId;
    var bookId = req.fields.bookId;
    var bookTitle = req.fields.bookTitle;
    var bookAuthor = req.fields.bookAuthor;
    var bookPress = req.fields.bookPress;
    var bookNum = req.fields.bookNum;
    var bookAbstract = req.fields.bookAbstract;
    var bookSorts = [];
    var bookBowNum = req.fields.bookBowNum;
    var temp=false;
    if (req.files.bookCover.size > 0) {
        var bookCover = req.files.bookCover.path.split(path.sep).pop();
    }

    // 根据checkbox判断并写入bookSorts
    var i = 0;
    var bookNum = req.fields.bookNum;
    var bookSort1 = req.fields.bookSort1;
    var bookSort2 = req.fields.bookSort2;
    var bookSort3 = req.fields.bookSort3;
    if (bookSort1!='null') {
        bookSorts[i] = bookSort1;
        temp=true;
        for (var j = 0; j < bookNum; j++)
            SortModel.updateSortBkNumBySortEname(bookSort1);
        i++;
    }
    if (bookSort2!='null' && bookSort2 != bookSort1) {
        bookSorts[i] = bookSort2;
        temp=true
        for (var j = 0; j < bookNum; j++)
            SortModel.updateSortBkNumBySortEname(bookSort2);
        i++;
    }
    if (bookSort3!='null' && bookSort3 != bookSort1) {
        if (bookSort3 != bookSort2) {
            bookSorts[i] = bookSort3;
            temp=true
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
        bookAbstract: bookAbstract,
        bookNum: parseInt(bookNum),
        bookBowNum: parseInt(bookBowNum)
    };
    if(temp){
        book.bookSorts=bookSorts;
    }
    // 重新设置了封面
    if (bookCover) {
        book.bookCover = bookCover;
    }
    BookModel.updateBookById(id, book)
        .then(function () {
            req.flash('success', '编辑书本成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/sorts/${sortId}/book/${id}/edit`);
        })
        .catch(function (e) {
            fs.unlink(req.files.bookCover.path);
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '条形码已被占用');
                return res.redirect(`/sorts/${sortId}/book/${id}/edit`);
            }
            next(e);
        });
});

module.exports = router;