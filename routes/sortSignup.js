/**
 * Created by 14798 on 2017/4/13.
 * 分类注册
 */

// 初始设置
var fs = require('fs');
var path = require('path');
var express = require('express');

var router = express.Router();

var SortModel = require('../models/sorts');
var checkLogin = require('../middlewares/check').checkLogin;
// GET书籍录入页面
router.get('/', checkLogin, function (req, res, next) {
    res.render('sortSignup');
});

// POST书籍录入路由library/bookSignup
router.post('/', checkLogin, function (req, res, next) {
    // 获取变量值
    var sortName = req.fields.sortName;
    var sortCover = req.files.sortCover.path.split(path.sep).pop();
    var sortBkNum = 0;
    // 校验参数
    try {
        if (!sortName) {
            throw new Error('请填写分类名称');
        }
        if (!req.files.sortCover.name) {
            throw new Error('选择封面文件');
        }
    } catch (e) {
        // 注册失败，异步删除上传的头像
        fs.unlink(req.files.sortCover.path);
        req.flash('error', e.message);
        return res.redirect('/sortSignup');
    }
    //模板赋值
    var sort = {
        sortName: sortName,
        sortCover: sortCover
    };

    SortModel.create(sort)
        .then(function () {
            req.flash('success', '类别注册成功');
            res.redirect('/sortSignup');
        })
        .catch(function (e) {
            // 用分类名称被占用则跳回分类注册页，而不是错误页
            fs.unlink(req.files.sortCover.path);
            if (e.message.match('E11000 duplicate key')) {
                req.flash('error', '分类名已被占用');
                return res.redirect('/sortSignup');
            }
            next(e);
        });
});

module.exports = router;

