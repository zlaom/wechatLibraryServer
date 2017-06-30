/**
 * 数据库初始化文件
 */
var config = require('config-lite');
var Mongolass = require('mongolass');
var mongolass = new Mongolass();
mongolass.connect(config.mongodb);

var moment = require('moment');
var objectIdToTimestamp = require('objectid-to-timestamp');

// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
    afterFind: function (results) {
        results.forEach(function (item) {
            item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
        });
        return results;
    },
    afterFindOne: function (result) {
        if (result) {
            result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
        }
        return result;
    }
});

//用户模型
exports.User = mongolass.model('User', {
    userId: {type: 'string'},
    phone: {type: 'string'},
    idCard: {type: 'string'}
});
exports.User.index({userId: 1}, {unique: true}).exec();// 根据用户名找到用户，用户名全局唯一

//管理员模型
exports.Manager = mongolass.model('Manager', {
    name: {type: 'string'},
    password: {type: 'string'}
});
exports.Manager.index({name: 1}, {unique: true}).exec();// 根据用户名找到用户，用户名全局唯一

//书本模型
exports.Book = mongolass.model('Book', {
    bookId: {type: 'string'},
    bookTitle: {type: 'string'},
    bookCover: {type: 'string'},
    bookAuthor: {type: 'string'},
    bookPress: {type: 'string'},
    bookSorts: [{type: 'string'}],
    bookAbstract: {type: 'string'},
    bookNum: {type: 'number'},
    bookCan: {type: 'number'},//可借数
    bookBowNum: {type: 'number'}//历史借阅数
});
exports.Book.index({bookId: 1}, {unique: true}).exec();//根据条形码值找到书，条形码值全局唯一

//分类模型
exports.Sort = mongolass.model('Sort', {
    sortName: {type: 'string'},
    sortCover: {type: 'string'},
    sortBkNum: {type: 'number'},
    sortEname: {type: 'string'}
});
exports.Sort.index({sortName: 1}, {unique: true}).exec();//根据分类名称找到分类，分类全局唯一

// 预约/已预约/借阅/已借阅/已还 模型具。可用于管理员借书，用户还书，历史借阅，书籍详情，个人中心功能或页面的实现
exports.BookStatus = mongolass.model('bookStatus', {
    bookId: {type: 'string'},
    userId: {type: 'string'},
    type: {type: 'string'},//预约/已预约/借阅/已借阅/已还标志位
    resources: {type: 'number'},//分配资源数
    createTime: {type: 'date'}
});

// 通知模型
exports.Message = mongolass.model('Message', {
    userId: {type: 'string'},
    author: {type: 'string'},
    messageData: {type: 'string'}
});
exports.Message.index({userId: 1, _id: -1}).exec();//根据用户名查找，按创建时间降序查看用户的文章列表
