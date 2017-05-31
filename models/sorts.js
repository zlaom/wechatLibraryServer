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

    //遍历所有分类
    showSorts: function showSorts() {
        return Sort.find().exec()
    },

    //将分类名变为英文分类
    getSortByBookSort: function getSortByBookSort(sorts) {
        return Sort.find({sortEname: sorts}).exec();
    },

    //根据分类名称使当前分类书本数量加一
    updateSortBkNumBySortEname: function updateSortBkNumBySortEname(sortEname) {
        return Sort.update({sortEname:sortEname},{$inc:{sortBkNum:1}}).exec();
    }

};