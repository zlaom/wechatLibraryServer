/**
 * Created by 14798 on 2017/6/23.
 * 用户管理
 */
var express = require('express');
var moment = require('moment');
var router = express.Router();
var UserModel = require('../models/users');// 用户模型
var BookStatusModel = require('../models/bookStatus');
var websocket = require('../public/js/webSocket');//websocket

var checkLogin = require('../middlewares/check').checkLogin;

// 获得所有用户
router.get('/', function (req, res, next) {
    UserModel.getUsers().then(function (users) {
        res.render('users', {
            users: users
        });
    }).catch(next);
});

// GET /users/:userId/edit 更新用户页面
router.get('/:userId/edit', checkLogin, function (req, res, next) {
    var id = req.params.userId;
    UserModel.getUserById(id)
        .then(function (user) {
            if (!user) {
                throw new Error('该用户不存在');
            }
            BookStatusModel.getBookStatusByUserId(id).then(function (bstatus) {
                res.render('userEdit', {
                    user: user,
                    bstatus: bstatus
                });
            });

        })
        .catch(next);
});

// POST /users/:userId/edit 更新用户信息
router.post('/:userId/edit', checkLogin, function (req, res, next) {
    console.log("66666666666666");
    var _id = req.params.userId;
    if(req.fields.message){
        var message='message_'+req.fields.message;
        console.log(message);
        websocket.sendUseMsg(_id,message);
        req.flash('success', '发送通知成功');
        // 编辑成功后跳转到上一页
        res.redirect(`/users/${_id}/edit`);
    }else{
        // 获取变量值
        var phone = req.fields.phone;
        var idCard = req.fields.idCard;

        //模板赋值
        var user = {
            phone: phone,
            idCard: idCard
        };
        UserModel.updateUserById(_id, user)
            .then(function () {
                console.log("成功");
                req.flash('success', '编辑用户成功');
                // 编辑成功后跳转到上一页
                res.redirect(`/users/${_id}/edit`);
            })
            .catch(next);
    }

});

// GET /users/:userId/remove 删除一个用户
router.get('/:userId/remove', checkLogin, function (req, res, next) {
    var userId = req.params.userId;
    UserModel.delUserById(userId)
        .then(function () {
            req.flash('success', '删除用户成功');
            // 删除成功后跳转到用户管理
            res.redirect('/users');
        })
        .catch(next);
});

// GET /users/:userId/status/:statusId/edit 更新状态页面
router.get('/:userId/status/:statusId/edit', checkLogin, function (req, res, next) {
    var id = req.params.statusId;
    BookStatusModel.getBookStatusByStatusId(id)
        .then(function (status) {
            if (!status) {
                throw new Error('该用户不存在');
            }
            res.render('bookStatusEdit', {
                bstatus: status
            });
        })
        .catch(next);
});

// POST /users/:userId/status/:statusId/edit 更新状态
router.post('/:userId/status/:statusId/edit', checkLogin, function (req, res, next) {
    // 获取变量值
    var userId = req.params.userId;
    var _id = req.params.statusId;
    var bookId = req.fields.bookId;
    var type = req.fields.type;

    //模板赋值
    var status = {
        bookId: bookId,
        type: type,
        updateTime:moment().toDate()
    };
    if(type=='borrow'){
        status.returnTime=moment().add(1,'M').toDate();
    }
    if(type=='reserve'){
        status.returnTime=moment().add(2,'d').toDate();
    }
    BookStatusModel.updateStatusById(_id, status)
        .then(function () {
            console.log("成功");
            req.flash('success', '编辑状态成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/users/${userId}/status/${_id}/edit`);
        })
        .catch(next);
});

// POST /users/:userId/status/:statusId/remove 删除状态
router.get('/:userId/status/:statusId/remove', checkLogin, function (req, res, next) {
    // 获取变量值
    var userId = req.params.userId;
    var statusId = req.params.statusId;
    BookStatusModel. delBookStatusByStatusId(statusId)
        .then(function () {
            req.flash('success', '删除状态成功');
            // 删除成功后跳转到用户管理
            res.redirect(`/users/${userId}/edit`);
        })
        .catch(next);
});

module.exports = router;

