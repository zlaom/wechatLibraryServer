/**
 * Created by 14798 on 2017/5/8.
 */
var Message = require('../lib/mongo').Message;

module.exports = {
    // 创建一条新的消息
    create: function create(message) {
        return Message.create(message).exec();
    },

    // 通过用户ID获取一个用户的所有消息并且按照时间排序
    getMessagesByUserId: function getMessagesByUserId(userId) {
        return Message.find({userId: userId})
            .sort({_id: -1})
            .addCreatedAt()
            .exec();
    },

    // 通过用户ID和messageId删除一条消息
    delMessagesByUserMessageId: function delMessagesByUserMessageId(userId, messageId) {
        return Message.remove({userId: userId, _id: messageId}).exec();
    }

};