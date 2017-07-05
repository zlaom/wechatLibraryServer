/**
 * Created by 14798 on 2017/5/13.
 * 包含一些操作状态记录的方法
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

    // 通过用户id得到预约的书
    getUserReserveBook: function getUserReserveBook(userId) {
        var query = {
            userId: userId,
            type: 'reserve'
        };
        return BookStatus.find(query)
            .sort({_id: -1})
            .addCreatedAt()
            .exec();
    },

    // 通过用户id得到已借的书
    getUserBorrowBook: function getUserReserveBook(userId) {
        var query = {
            userId: userId,
            type: 'borrow'
        };
        return BookStatus.find(query)
            .sort({_id: -1})
            .exec();
    },

    // 通过用户id和图书id更新一个状态
    updateStatusByUserBook: function updateStatusByUserBook(userId, bookId, type1,type2) {
        return BookStatus.update({userId: userId, bookId: bookId,type:type1}, {$set: {type: type2}}).exec();
    },

    // 通过用户id和图书id更新获得资源数
    updateStatusResourcesByUserBookType: function updateStatusResourcesByUserBookType(userId, bookId, type, resources) {
        return BookStatus.update({userId: userId, bookId: bookId, type: type}, {$set: {resources: resources}}).exec();
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
    getBookStatusByUserIdBookIdType: function getBookStatusByUserIdBookIdType(userId, bookId, type) {
        return BookStatus.findOne({userId: userId, bookId: bookId, type: type}).exec();
    },

    // 通过bookId删除状态记录
    delBookStatusByBookId: function delBookStatusByBookId(bookId) {
        return BookStatus.remove({bookId: bookId}).exec();
    },
    // 通过userId删除状态记录
    delBookStatusByUserId: function delBookStatusByUserId(Id) {
        return BookStatus.remove({userId: Id}).exec();
    },
    // 通过statusId删除状态记录
    delBookStatusByStatusId: function delBookStatusByStatusId(Id) {
        return BookStatus.remove({_id: Id}).exec();
    },
    //通过用户ID获取状态记录
    getBookStatusByUserId: function getBookStatusByUserId(userId) {
        return BookStatus.find({userId: userId})
            .addCreatedAt()
            .sort({_id: -1})
            .exec();
    },

    // 通过id获取状态
    getBookStatusByStatusId: function getBookStatusByStatusId(id) {
        return BookStatus.findOne({_id: id}).exec();
    },

    // 根据id更改状态
    updateStatusById: function updateStatusById(id, data) {
        return BookStatus.update({_id: id}, {$set: data}).exec();
    },

    getBookStatusBy_id:function getBookStatusBy_id(_id) {
        return BookStatus.findOne({'_id':_id}).exec();
    },
    //通过_id查找，并更新状态
    updateBookStatusBy_id:function updateBookStatusBy_id(_id,type) {
        return BookStatus.update({'_id':_id},{$set:{'type':type}}).exec();

    },
    // 找到下一个可以拿到这本书的预约用户
    findNextReserveUser: function findNextReserveUser(){
       return  BookStatus.find({'type': 'reserve'}).sort({'createTime': 1}).limit(1).exec()
    },

    // 查找用户状态type不为某个值的记录
    findNotType:function findNotType(userId,type){
        return BookStatus.find({userId:userId,type:{$nin:type}}).exec();
    },

    // 查找用户状态type不为某个值的记录
    findLimitNotType:function findLimitNotType(userId,type,limitNum){
        return BookStatus.find({userId:userId,type:{$nin:type}})
            .sort({_id:-1})
            .limit(limitNum)
            .exec();
    },

    // 返回某个用户的某个状态
    findOneTypeByUserId:function findOneTypeByUserId(userId,type){
        return BookStatus.find({userId:userId,type:type}).exec();
    },

    //全部更新
    allUpDataByStatusId:function allUpDataByStatusId(statusId,status){
        return BookStatus.update({_id:statusId},{$set:status}).exec();
    }
};