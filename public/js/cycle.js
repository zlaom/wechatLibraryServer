/**
 * Created by 14798 on 2017/5/12.
 */
var Message = require('../../models/messages');
var Book = require('../../models/books');
var BookStatus = require('../../models/bookStatus');
var moment = require('moment');

//每天检测一次借书数据并提醒还书
setInterval(function () {
    // 还书提醒


    // 拖欠提醒
    var thirtyDayAgo = moment().subtract(30, 'days').toDate();
    var type = "borrow";
    BookStatus.getBookStatusByEnd(thirtyDayAgo, type).then(function (obj) {
        /*  for (var i = 0; i < obj.length; i++) {
         (function (obj) {
         var message = {
         userId: '',
         author: '',
         messageData: ''
         };
         var userId = obj.userId;
         var borrowTime = obj.createTime;
         console.log(moment(thirtyDayAgo).toDate());
         console.log(moment(borrowTime).toDate());
         var jetLag = moment(thirtyDayAgo).diff(moment(borrowTime), 'days');// 时差
         console.log(jetLag);
         message.userId = userId;
         message.author = '图书馆';
         Book.getBookByBookId(obj.bookId).then(function (obj) {
         var bookTitle = obj.bookTitle;
         message.messageData = '您借的《' + bookTitle + '》已经超期' + jetLag + '天，请尽快归还！';
         console.log(message);
         Message.create(message);
         })
         })(obj[i], i);

         }*/
    });
}, 1000);

