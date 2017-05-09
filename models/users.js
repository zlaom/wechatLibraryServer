var User = require('../lib/mongo').User;

module.exports = {
    // 注册一个用户
    create: function create(user) {
        return User.create(user).exec();
    },

    // 通过用户名获取用户信息
    getUserById: function getUserByName(userId) {
        return User.findOne({userId: userId}).exec();
    }
};
