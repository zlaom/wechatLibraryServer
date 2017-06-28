/**
 * Created by 14798 on 2017/6/23.
 */
var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var ManagerModel = require('../models/manager');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
    res.render('managerSignup');
});

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
    var name = req.fields.name;
    var code = '1479833945';//管理员注册密钥
    var password = req.fields.password;
    var repassword = req.fields.repassword;
    var mpassword = req.fields.mpassword;

    // 校验参数
    try {
        if (!(name.length >= 1 && name.length <= 10)) {
            throw new Error('名字请限制在 1-10 个字符');
        }
        if (password.length < 6) {
            throw new Error('密码至少 6 个字符');
        }
        if (password !== repassword) {
            throw new Error('两次输入密码不一致');
        }
        if(mpassword!==code){
            throw new Error('管理员密码不一致');
        }
    } catch (e) {
/*        // 注册失败，异步删除上传的头像
        fs.unlink(req.files.avatar.path);*/
        req.flash('error', e.message);
        return res.redirect('/managerSignup');
    }

    // 明文密码加密
    password = sha1(password);

    // 待写入数据库的用户信息
    var manager = {
        name: name,
        password: password
    };
    // 用户信息写入数据库
    ManagerModel.create(manager)
        .then(function (result) {
            // 此 user 是插入 mongodb 后的值，包含 _id
            manager = result.ops[0];
            // 将用户信息存入 session
            delete manager.password;
            req.session.user = manager;
            // 写入 flash
            req.flash('success', '注册成功');
            // 跳转到首页
            res.redirect('/books');
        })
        .catch(function (e) {
            // 用户名被占用则跳回注册页，而不是错误页
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '用户名已被占用');
                return res.redirect('/managerSignup');
            }
            next(e);
        });
});

module.exports = router;