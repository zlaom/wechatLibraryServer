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
    //mongodb: 'mongodb://youknow:youknow@ds143588.mlab.com:43588/wechatlibrary',
     // 本地测试数据库连接地址
     mongodb: 'mongodb://localhost:27017/library',
    // 推荐设置
    defaultRecommendSorts: ['语文'],//按照分类
    recommendNum: 5//推荐书本数
};
