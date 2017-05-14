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
exports.User.index({phone: 1}, {unique: true}).exec();// 根据用户名找到用户，用户名全局唯一

//书本模型
exports.Book = mongolass.model('Book', {
    bookId: {type: 'string'},
    bookTitle: {type: 'string'},
    bookCover: {type: 'string'},
    bookAuthor: {type: 'string'},
    bookPress: {type: 'string'},
    bookSorts: [{type:'string'}],
    bookAbstract: {type: 'string'},
    bookNum: {type: 'number'},
    bookCan: {type: 'number'},
    bookBowNum: {type: 'number'}
});
exports.Book.index({bookId: 1}, {unique: true}).exec();//根据条形码值找到书，条形码值全局唯一

//分类模型
exports.Sort = mongolass.model('Sort', {
    sortName: {type: 'string'},
    sortCover: {type: 'string'},
    sortBkNum: {type: 'int'}
});
exports.Sort.index({sortName: 1}, {unique: true}).exec();//根据分类名称找到分类，分类全局唯一

// 预约/借阅模型
exports.BookStatus = mongolass.model('bookStatus',{
    bookId : {type:'string'},
    userId : {type:'string'},
    type:{type:'string'},
    createTime:{type:'date'}
});
exports.BookStatus.index({time:1},{expireAfterSeconds:60}).exec();// 设置过期索引

// 通知模型
exports.Message = mongolass.model('Message',{
    userId:{type:'string'},
    author:{type:'string'},
    messageData:{type:'string'}
});
exports.Message.index({userId:1,_id:-1}).exec();//根据用户名查找，按创建时间降序查看用户的文章列表








/*exports.Post = mongolass.model('Post', {
  author: { type: Mongolass.Types.ObjectId },
  title: { type: 'string' },
  content: { type: 'string' },
  pv: { type: 'number' }
});
exports.Post.index({ author: 1, _id: -1 }).exec();// 按创建时间降序查看用户的文章列表

exports.Comment = mongolass.model('Comment', {
  author: { type: Mongolass.Types.ObjectId },
  content: { type: 'string' },
  postId: { type: Mongolass.Types.ObjectId }
});
exports.Comment.index({ postId: 1, _id: 1 }).exec();// 通过文章 id 获取该文章下所有留言，按留言创建时间升序*/
