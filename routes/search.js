/**
 * Created by 14798 on 2017/5/16.
 */
/**
 * Created by Damian on 2017/5/14.
 */
var express = require('express');
var router = express.Router();
var Book = require('../models/books');// 书籍模型

router.get('/',function (req,res,next) {
    var queryTitle={};
    queryTitle['bookTitle']=new RegExp(req.query.content);
    Book.getBookBySearch(queryTitle).then(function (obj) {
        console.log(obj.length);
        if(!obj.length){
            console.log("找不到书名，开始找作者");
            var queryAuthor={};
            queryAuthor['bookAuthor']= new RegExp(req.query.content);
            console.log('dsadsadsadsad'+req.query.content);
            Book.getBookBySearch(queryAuthor).then(function (obj) {
                if (!obj.length) {
                    var message='not found';
                    res.send(message);
                }else{
                    console.log(obj.length);
                    var data = [];
                    for (var i = 0; i < obj.length; i++) {
                        data[i] = {
                            id: obj[i].bookId,
                            cover: obj[i].bookCover,
                            bookName: obj[i].bookTitle,
                            bookAuthor:obj[i].bookAuthor,
                            bookAbstract: obj[i].bookAbstract,
                            bookNum: obj[i].bookNum,
                            canBorrow: obj[i].bookCan
                        }
                    }
                    res.send(data);
                }
            });
        }else{
            console.log("找到书名");
            console.log(obj);
            var data=[];
            for(var i=0;i<obj.length;i++){
                data[i]={
                    id:obj[i].bookId,
                    cover: obj[i].bookCover,
                    bookName: obj[i].bookTitle,
                    bookAuthor:obj[i].bookAuthor,
                    bookAbstract: obj[i].bookAbstract,
                    bookNum: obj[i].bookNum,
                    canBorrow: obj[i].bookCan
                }
            }

            res.send(data);

        }
    })
});

module.exports = router;
