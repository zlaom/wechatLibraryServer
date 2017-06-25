/**
 * Created by 14798 on 2017/4/13.
 */
var Sort = require('../lib/mongo').Sort;

/**
 * Created by 14798 on 2017/4/13.
 */
var Sort = require('../lib/mongo').Sort;

module.exports = {
    // 注册一个分类
    create: function create(sort) {
        return Sort.create(sort).exec();
    },

    //查找所有所有分类
    showSorts: function showSorts() {
        return Sort.find()
            .sort({_id: -1})
            .addCreatedAt()
            .exec()
    },
    // 根据sortId查找一个分类
    getSortBySortId: function getSortBySortId(sortId){
        return Sort.findOne({_id:sortId}).exec();
    },
    //将分类名变为英文分类
    getSortByBookSort: function getSortByBookSort(sorts) {
        return Sort.find({sortEname: sorts}).exec();
    },

    //根据分类名称使当前分类书本数量加一
    updateSortBkNumBySortEname: function updateSortBkNumBySortEname(sortEname) {
        return Sort.update({sortEname:sortEname},{$inc:{sortBkNum:1}}).exec();
    },
    // 根据sortId跟新数据
    updateSortById: function updateSortById(sortId,data){
        return Sort.update({ _id: sortId}, { $set: data }).exec();
    },
    // 根据sortId删除sort
    delSortById: function delSortById(sort){
        return Sort.remove({_id:sort}).exec();
    }

};