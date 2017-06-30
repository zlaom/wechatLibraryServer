/**
 * Created by 14798 on 2017/4/13.
 * 书籍注册
 */
// 初始设置
var fs = require('fs');
var path = require('path');
var express = require('express');
var router = express.Router();
var BookModel = require('../models/books');
var SortModel = require('../models/sorts');

var checkLogin = require('../middlewares/check').checkLogin;

//GET /bookSignup 书籍录入页面
router.get('/', checkLogin, function (req, res, next) {
    SortModel.showSorts().then(function (sorts) {
        res.render('bookSignup', {
            sorts: sorts
        });
    })
});

// POST /bookSignup 书籍录入
router.post('/', checkLogin, function (req, res, next) {
    // 获取变量值
    var bookId = req.fields.bookId;
    var bookTitle = req.fields.bookTitle;
    var bookCover = req.files.bookCover.path.split(path.sep).pop();
    var bookAuthor = req.fields.bookAuthor;
    var bookPress = req.fields.bookPress;
    var bookNum = req.fields.bookNum;
    var bookAbstract = req.fields.bookAbstract;
    var bookSorts = [];
    var bookCan = bookNum;
    var bookBowNum = '0';

    // 根据checkbox判断并写入bookSorts
    var i = 0;
    var bookNum = req.fields.bookNum;
    var bookSort1 = req.fields.bookSort1;
    var bookSort2 = req.fields.bookSort2;
    var bookSort3 = req.fields.bookSort3;

    // 增加分类下的书本数目
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
    // 校验参数
    try {
        if (!bookId) {
            throw new Error('请填写条形码值');
        }
        if (!bookTitle) {
            throw new Error('请填写书名');
        }
        if (!req.files.bookCover.name) {
            throw new Error('选择封面文件');
        }
        if (!bookAuthor) {
            throw new Error('请填写作者');
        }
        if (!bookPress) {
            throw new Error('请填写出版社');
        }
        if(i=0){
            throw new Error('请至少填写一个所属分类');
        }
        if(!bookNum){
            throw new Error('请填写书籍数量');
        }
        if (!(bookAbstract.length>0 )) {
            throw new Error('请填写书籍简介');
        }
    } catch (e) {
        // 注册失败，异步删除上传的头像
        fs.unlink(req.files.bookCover.path);
        req.flash('error', e.message);
        return res.redirect('/bookSignup');
    }

    //模板赋值
    var book = {
        bookId: bookId,
        bookTitle: bookTitle,
        bookCover: bookCover,
        bookAuthor: bookAuthor,
        bookPress: bookPress,
        bookSorts: bookSorts,
        bookAbstract: bookAbstract,
        bookNum: parseInt(bookNum),
        bookCan: parseInt(bookCan),
        bookBowNum: parseInt(bookBowNum)
    };

    //书籍录入
    BookModel.create(book)
        .then(function () {
            // 跳转到主页
            res.redirect('/books');
        }) .catch(function (e) {
        fs.unlink(req.files.bookCover.path);
        if (e.message.match('E11000 duplicate key')) {
            req.flash('error', '条形码已被占用');
            return res.redirect('/bookSignup');
        }
        next(e);
    });// 记得写纠错


});

module.exports = router;

