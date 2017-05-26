var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', function (req, res, next) {
    console.log(req.query);
});

// POST /signup 用户注册
router.post('/', function (req, res, next) {
    console.log("登陆");
    //var code = req.fields.code;
    var userId = req.fields.userId;
    var phone = req.fields.phone;
    var idCard = req.fields.idCard;

    console.log(userId + " " + phone + " " + idCard);
    var user = {
        userId: userId,
        phone: phone,
        idCard: idCard
    };
    // 用户信息写入数据库
    function setUser(oneuser, callback) {
        var feedback = 'null';
        UserModel.create(oneuser)
            .then(function (result) {
                feedback = 'success';
                if (callback && typeof(callback) === "function") {
                    callback(feedback);
                }
            })
            .catch(function (e) {//错误判断
                if (e.message.match('E11000 duplicate key')) {
                    feedback = '用户已存在';
                    if (callback && typeof(callback) === "function") {
                        callback(feedback);
                    }
                }
            });
    }

    setUser(user, function (data) {
        res.send(data);
    })
});

router.get('/ifExist', function (req, res) {
    var userId = req.query.userId;
    console.log(userId);
    UserModel.getUserById(userId)
        .then(function (obj) {
            console.log(obj);
            if (!obj) {
                res.send("notExist");
                console.log("notExist");
            } else {
                res.send("exist");
            }
        });
});

module.exports = router;
