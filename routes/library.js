/**
 * Created by 14798 on 2017/4/15.
 */
var express = require('express');
var router = express.Router();
var BookModel = require('../models/books');
router.get('/bookDetail', function (req, res, next) {
    /* '9787115230959'*/
    console.log(req);
    var bookId = req.query.bookId;
    var book;
    console.log('bookId' + bookId);
    book = BookModel.getBookByBookId(bookId).then(function (book) {
        console.log(book);
        book.bookCover = 'http://localhost:3000/img/' + book.bookCover;
        var sorts="";
        for (var i = 0; i < book.bookSorts.length; i++) {
            var sort=book.bookSorts[i];
            console.log('替换' + sort);
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
                default:
                    break;
            }
            console.log('sort'+sort);
            sorts=sort+' '+sorts;
        }
        book.bookSorts=sorts;
        res.send(book);
    });
});

module.exports = router;

