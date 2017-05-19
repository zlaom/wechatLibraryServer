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
    var code = req.fields.code;
    var phone = req.fields.phone;
    var idcard = req.fields.idcard;

    console.log(code + " " + phone + " " + idcard);
/*    var user = {
        userId: userId,
        phone: phone,
        idcard: idcard
    };*/
    // 用户信息写入数据库
    /*    function setUser(oneuser, callback) {
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
     feedback = '电话已被占用';
     if (callback && typeof(callback) === "function") {
     callback(feedback);
     }
     }
     });
     }

     setUser(user, function (data) {
     res.send(data);
     })*/
    res.send('success');
});

module.exports = router;
