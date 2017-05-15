/**
 * Created by 14798 on 2017/5/13.
 */
var BookStatus = require('../lib/mongo').BookStatus;

module.exports = {

    // 通过bookId预约一本书
    bookStatus: function bookStatus(bookStatus) {
        return BookStatus.create(bookStatus).exec();
    },

    // 根据用户和书本取消一本书的预约
    delBookStatus: function delBookStatus(userId, bookId, type) {
        return BookStatus.remove({userId: userId, bookId: bookId, type: type}).exec();
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

    // 获得一段时间的书本状态
    getBookStatusByStartEnd: function getBookStatusByTime(start, end, type) {
        return BookStatus.find({createTime: {$gte: start, $lt: end}, type: type}).exec();
    },

    // 获得一个时间之前的书本状态
    getBookStatusByEnd: function getBookStatusByStart(end, type) {
        return BookStatus.find({createTime: {$lt: end}, type: type}).exec();
    },

    //通过userId和bookId获得一个用户的bookStatus
    getBookStatusByUserIdBookId: function getBookStatusByUserIdBookId(userId, bookId, type) {
        return BookStatus.findOne({userId: userId, bookId: bookId, type: type}).exec();
    }

};