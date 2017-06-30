/**
 * 用于检测管理员是否登陆
 * @type {{checkLogin: module.exports.checkLogin, checkNotLogin: module.exports.checkNotLogin}}
 */
module.exports = {
    //检测已经登陆
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '未登录');
            return res.redirect('/signin');
        }
        next();
    },
    //检测未登陆
    checkNotLogin: function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('back');//返回之前的页面
        }
        next();
    }
};
