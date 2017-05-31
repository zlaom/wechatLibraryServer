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
    },

    // 增加书本可借数一本
    bookCanInc: function bookCanInc(bookId) {
        return Book.update({bookId: bookId}, {$inc: {bookCan: 1}}).exec(); // 增加可借数
    },

    // 减少书本可借数一本
    bookCanCut:function bookCanCut(bookId) {
        return Book.update({bookId: bookId}, {$inc: {bookCan: -1}}).exec();// 减少可借数
    },

    // 按照搜索内容查找
    getBookBySearch: function getBookBySearch(query) {
        return Book.find(query).exec()
    }
};
