/**
 * Created by 14798 on 2017/4/13.
 */
var Book = require('../lib/mongo').Book;

module.exports = {
    // 注册一本书
    create: function create(book) {
        return Book.create(book).exec();
    },

    // 通过bookId查找一本书
    getBookByBookId: function getBookByBookId(bookId) {
        console.log(bookId);
        var query={bookId: bookId};
        console.log(query);
        return Book.findOne(query);
    }

    //
};
/*
bookCover: res.data.bookCover,
    bookName: res.data.bookName,
    bookAuthor: res.data.bookAuthor,
    bookPress: res.data.bookPress,
    bookSort: res.data.bookSort,
    bookAbstract: res.data.bookAbstract,
    bookNum: res.data.bookNum,
    bookCan: res.data.bookCan*/
