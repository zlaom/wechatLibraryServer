/**
 * 默认配置文件
 */
module.exports = {
    // 监听端口号
    port: 3001,
    session: {
        secret: 'library',
        key: 'library',
        maxAge: 2592000000
    },
    //  网络mongodb连接地址
    mongodb: 'mongodb://youknow:youknow@ds143588.mlab.com:43588/wechatlibrary',
     // 本地测试数据库连接地址
     //mongodb: 'mongodb://localhost:27017/library',

    //推荐参数配置
    type : ['cancelRe', 'recommend'],//搜集数据不需要取消借阅状态，推荐状态的书
    userDataNum:10,//// 推荐根据的书籍数量
    bookNum:5,//推荐书籍最大数量
    pLimit:10,//每次数据库查找的书本数量

    wBookName:5,//书名权值
    wAuthor:4,//作者权值
    wSort:3//分类权值
};
