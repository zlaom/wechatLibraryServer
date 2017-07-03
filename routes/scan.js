/**
 * Created by hasee on 2017/6/30.
 */
var express = require('express');
var router = express.Router();
var BookStatus = require('../models/bookStatus');
var BookModel = require('../models/books');// 书籍模型
var MessageModel = require('../models/messages');// 消息模型


router.post('/', function (req, res, next) {
    console.log('scan\n');
    var bookStateId = req.fields.bookStateId;
    console.log(bookStateId);
    var data = "";
    var userId = '';
    var author = '管理员';
    var messageData = '';
    var bookTitle = '';
    var msg = {};

    BookStatus.getBookStatusBy_id(bookStateId).then(function (obj) {
        if (!obj) {
            data = '操作失败！找不到对应记录!';
            res.send(data);
        } else {
            userId = obj.userId;

            BookModel.getBookByBookId(obj.bookId).then(function (obj1) {
                bookTitle = obj1.bookTitle;
                if (obj.type == "borrow") {
                    BookStatus.updateBookStatusBy_id(bookStateId, "returned");

                    BookStatus. findNextReserveUser().then(function (obj2) {
                        if (!obj2) {
                            BookModel.bookCanInc(obj.bookId);
                            console.log("没有人预约" + bookTitle);
                        } else {
                            var statusId = obj2._id;
                            var userId2 = obj2.userId;
                            BookStatus.update({'_id': statusId}, {"resources": 1});
                            var message2 = {
                                userId: userId2,
                                author: '管理员',
                                messageData: '您预约的《' + bookTitle + '》到了，请及时领取'
                            };

                            MessageModel.create(message2);
                        }
                    });


                    messageData = "已成功归还：《" + bookTitle + '》！';

                    data = '还书成功！';
                } else if (obj.type == "reserve") {
                    BookStatus.updateBookStatusBy_id(bookStateId, "borrow");
                    messageData = "已成功借阅：《" + bookTitle + '》！';

                    data = '借书成功！';
                } else if (obj.type == "returned") {
                    data = '操作失败！图书已经被归还！';
                } else {
                    data = '出现不明错误！';
                }

                if(messageData!=''){// 防止发送空消息
                    msg = {
                        userId: userId,
                        author: author,
                        messageData: messageData
                    };
                    MessageModel.create(msg);
                }
                res.send(data);

            });


        }

    })
});


module.exports = router;
