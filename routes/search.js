/**
 * Created by 14798 on 2017/5/16.
 * 搜索操作
 */

var express = require('express');
var router = express.Router();
var Book = require('../models/books');// 书籍模型

/**
 * 搜索功能
 */
router.get('/', function (req, res, next) {
    var reg = new RegExp(req.query.content);
    var queryTitle = {
        $or: [
            {'bookTitle': reg},
            {'bookId': reg},
            {'bookInitial': reg},
            {'bookCompleteSpelling': reg},
            {'bookAuthor': reg}
        ]
    };
    Book.getBookBySearch(queryTitle).then(function (obj) {
        console.log(obj.length);
        if (!obj.length) {
            var message = 'not found';
            res.send(message);
        } else {
            var data = [];
            for (var i = 0; i < obj.length; i++) {
                data[i] = {
                    bookId: obj[i].bookId,
                    bookCover: obj[i].bookCover,
                    bookName: obj[i].bookTitle,
                    bookAuthor: obj[i].bookAuthor,
                    bookAbstract: obj[i].bookAbstract,
                    bookNum: obj[i].bookNum,
                    canBorrow: obj[i].bookCan
                }
            }
            res.send(data);
        }
    });
});

module.exports = router;
