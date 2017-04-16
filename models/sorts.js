/**
 * Created by 14798 on 2017/4/13.
 */
var Sort = require('../lib/mongo').Sort;

module.exports = {
    // 注册一个用户
    create: function create(sort) {
        return Sort.create(sort).exec();
    }
};