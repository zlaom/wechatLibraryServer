/**
 * Created by 14798 on 2017/6/23.
 */
/**
 * Created by 14798 on 2017/4/13.
 * 包含一些对管理员数据库操作的函数
 */
var Manager = require('../lib/mongo').Manager;

module.exports = {
    // 注册一个管理员
    create: function create(manager) {
        return Manager.create(manager).exec();
    },

    // 通过用户名获取用户信息
    getManagerByName: function getManagerByName(name) {
        return Manager
            .findOne({name: name})
            .addCreatedAt()
            .exec();
    }
};
