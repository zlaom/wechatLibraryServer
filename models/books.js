/**
 * Created by 14798 on 2017/4/13.
 */
var Book = require('../lib/mongo').Book;
var BookStatus = require('../lib/mongo').BookStatus;

module.exports = {
    // 注册一本书
    create: function create(book) {
        return Book.create(book).exec();
    },

    // 通过bookId查找一本书
    getBookByBookId: function getBookByBookId(bookId) {
        //console.log(bookId);
        var query = {bookId: bookId};
        //console.log(query);
        return Book.findOne(query);
    },

    // 通过分类查找一类书
    getBooksByBookSort: function getBooksByBookSort(sorts) {
        return Book.find({bookSorts: sorts}).exec();
    },

    // 查找一个分类
    getBooksBySort: function getBooksBySort(sort) {
        return Book.find({bookSorts: sort}).exec()
    },

    // 通过Sorts和bookId查找这一本书的4本相关书籍
    getRelaBooksByBookId: function getRelaBooksByBookId(Sorts, bookId) {
        return Book.find({bookSorts: {$in: Sorts}, bookId: {$ne: bookId}}).sort({"bookBowNum": -1}).limit(4);
        /*var query={bookId: bookId};
         console.log("bookid"+bookId);
         Book.findOne(query).then(function (book) {
         Sorts = book.bookSorts;
         return Book.find({bookSorts:{$in:Sorts},bookId:{$ne:bookId}}).sort({"bookBowNum":-1}).limit(4);
         });*/
    },

    // 增加书本可借数一本
    bookCanInc: function bookCanInc(bookId) {
        return Book.update({bookId: bookId}, {$inc: {bookCan: 1}}).exec(); // 增加可借数
/*        console.log("7777777777777777" + num);
        if (num == 0) {
            Book.findOne({bookId: bookId}).then(function (book) {
                if (book.bookCan != 0) {
                    Book.update({bookId: bookId}, {$inc: {bookCan: -1}});// 减少可借数
                }
            });
        }else{
            Book.update({bookId: bookId}, {$inc: {bookCan: 1}}); // 增加可借数
            console.log("加一2");
        }*/
    },
    // 减少书本可借数一本
    bookCanCut:function bookCanCut(bookId) {
        return Book.update({bookId: bookId}, {$inc: {bookCan: -1}}).exec();// 减少可借数
    },

    // 按照搜索内容查找
    getBookBySearch: function getBookBySearch(query) {
        return Book.find(query).exec()
    }

    /* // 通过bookId预约一本书
     bookStatus:function bookStatus(bookStatus){
     return BookStatus.create(bookStatus).exec();
     },

     // 根据用户和书本取消一本书的预约
     delBookStatus:function delBookStatus(userId,bookId,type) {
     return BookStatus.remove({userId:userId,bookId:bookId,type:type}).exec();
     },

     // 图书状态
     // 通过用户id得到预约的书
     getUserReserveBook: function getUserReserveBook(userId) {
     var query = {
     userId: userId,
     type: 'reserve'
     };
     return BookStatus.find(query).exec();
     },

     // 通过用户id得到已借的书
     getUserBorrowBook: function getUserReserveBook(userId) {
     var query = {
     userId: userId,
     type: 'borrow'
     };
     return BookStatus.find(query).exec();
     },

     // 通过
     getBookStatusByTime:function getBookStatusByTime(start,end) {
     console.log(start);
     return BookStatus.find({createTime: {$gte: start, $lt: end}}).exec();
     },

     //通过userId和bookId获得一个用户的bookStatus
     getBookStatusByUserIdBookId:function getBookStatusByUserIdBookId(userId,bookId,type) {
     return BookStatus.findOne({userId:userId,bookId:bookId,type:type}).exec();
     }*/
};
