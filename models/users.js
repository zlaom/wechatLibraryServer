/**
 * 包含一些对用户数据库操作的函数
 */
var User = require('../lib/mongo').User;
var BookStatus = require('./bookStatus');
var Message = require('./messages');

module.exports = {
    // 注册一个用户
    create: function create(user) {
        return User.create(user).exec();
    },

    // 通过用户id删除一个用户
    delUserById: function delUserById(id) {
        return User.remove({userId: id}).then(function (res) {
            // 删除对应的用户状态记录
            if (res.result.ok && res.result.n > 0) {
                return BookStatus.delBookStatusByUserId(id).then(function (res) {
                    // 删除对应的用户消息记录
                    if (res.result.ok && res.result.n > 0) {
                        return Message.getMessagesByUserId(id);
                    }
                });
            }
        });
    },

    // 通过用户名获取用户信息
    getUserById: function getUserByName(userId) {
        return User.findOne({userId: userId}).exec();
    },

    // 获取所有用户信息
    getUsers: function getUsers() {
        return User.find().exec();
    },

    // 根据Id更改用户信息
    updateUserById: function updateUserById(id, data) {
        return User.update({userId: id}, {$set: data}).exec();
    }
};
