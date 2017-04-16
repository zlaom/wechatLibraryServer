/**
 * Created by 14798 on 2017/4/13.
 */
var fs = require('fs');
var path = require('path');
var express = require('express');

var router = express.Router();

var BookModel = require('../models/books');

router.get('/', function (req, res, next) {
    console.log('bookGet');
    res.render('bookSignUp');
});

router.post('/', function (req, res, next) {
    console.log(req);
    console.log('bookPost');
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
    //bookSorts写入
    var i = 0;
    if (req.fields.english) {
        bookSorts[i] = 'e';
        i++;
    }
    if (req.fields.computer) {
        bookSorts[i] =  'c';
        i++;
    }
    if (req.fields.science) {
        bookSorts[i] = 's';
        i++;
    }
    if (req.fields.history) {
        bookSorts[i] =  'h';
        i++;
    }
    if (req.fields.literature) {
        bookSorts[i] = 'l';
        i=0;
    }

    /*    console.log(bookSorts);
     console.log(bookSorts[1].sort);*/

    var book={
        bookId: bookId,
        bookTitle : bookTitle,
        bookCover : bookCover,
        bookAuthor : bookAuthor,
        bookPress : bookPress,
        bookSorts : bookSorts,
        bookAbstract : bookAbstract ,
        bookNum : bookNum,
        bookCan : bookCan,
        bookBowNum: bookBowNum
    };

    BookModel.create(book);//写纠错
    console.log(book);
    res.send();
});

module.exports = router;

