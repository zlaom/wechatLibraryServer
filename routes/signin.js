/**
 *管理员登陆
 */
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var ManagerModel = require('../models/manager');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
    res.render('signin');
});

// POST /signin 管理员登录
router.post('/', checkNotLogin, function (req, res, next) {
    var name = req.fields.name;
    var password = req.fields.password;

    ManagerModel.getManagerByName(name)
        .then(function (user) {
            if (!user) {
                req.flash('error', '用户不存在');
                return res.redirect('back');
            }
            // 检查密码是否匹配
            if (sha1(password) !== user.password) {
                req.flash('error', '用户名或密码错误');
                return res.redirect('back');
            }
            req.flash('success', '登录成功');
            // 用户信息写入 session
            delete user.password;
            req.session.user = user;
            // 跳转到主页
            res.redirect('/books');
        })
        .catch(next);
});

//管理员登陆
router.post('/managerapp', function (req, res, next) {
    var account = req.fields.account;
    var password = req.fields.password;

    ManagerModel.getManagerByName(account).then(function (manager) {
        if (!manager) {
            res.send("用户不存在");
        } else if (password != manager.password) {
            res.send("密码错误");
        } else {
            res.send("成功登录");
        }
    })
});

module.exports = router;
