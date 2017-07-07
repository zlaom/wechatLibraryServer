/**
 * Created by 14798 on 2017/4/13.
 * 包含一些对书籍操作的函数
 */
var Book = require('../lib/mongo').Book;
var BookStatus = require('./bookStatus');
var config = require('config-lite');
module.exports = {
    // 录入一本书
    create: function create(book) {
        return Book.create(book).exec();
    },

    // 获得所有书
    getBooks: function getBooks() {
        return Book
            .find()
            .sort({_id: -1})//按照时间降序排序
            .addCreatedAt()
            .exec();
    },

    // 通过bookId查找一本书
    getBookByBookId: function getBookByBookId(bookId) {
        var query = {bookId: bookId};
        return Book.findOne(query);
    },

    // 通过分类查找一类书
    getBooksByBookSort: function getBooksByBookSort(sorts,limit,skipNum) {
        return Book.find({bookSorts: sorts})
            .sort({_id:-1})
            .skip(skipNum)
            .limit(limit)
            .exec();
    },

    // 通过分类查找推荐书籍
    getRecommendBooksByBookSort: function getBooksByBookSort(sorts) {
        return Book.find({bookSorts: {$in: sorts}}).limit(config.recommendNum).exec();
    },

    // 查找一个分类下的所有书
    getBooksBySort: function getBooksBySort(sort) {
        return Book.find({bookSorts: sort})
            .addCreatedAt()
            .exec()
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
    bookCanCut: function bookCanCut(bookId) {
        return Book.update({bookId: bookId}, {$inc: {bookCan: -1}}).exec();// 减少可借数
    },

    // 按照搜索内容查找
    getBookBySearch: function getBookBySearch(query,limitNum,skipNum) {
        return Book.find(query)
            .sort({bookBowNum:-1})
            .skip(skipNum)
            .limit(limitNum)
            .exec()
    },

    // 通过bookId删除一本书
    delBookById: function delBookById(bookId) {
        return Book.remove({bookId: bookId}).exec().then(function (res) {
            // 删除对应的书籍状态记录
            if (res.result.ok && res.result.n > 0) {
                return BookStatus.delBookStatusByBookId(bookId);
            }
        });
    },

    // 通过bookId更新数据
    updateBookById: function updateBookById(bookId, data) {
        return Book.update({bookId: bookId}, {$set: data}).exec();
    },

    // 按照借阅热度排序查询一定范围内的数据
    findSortBrow:function findSortBrow(skipNum,limitNum){
        return Book.find()
            .sort({bookBowNum:-1})
            .skip(skipNum)
            .limit(limitNum)
            .exec();
    }

};
