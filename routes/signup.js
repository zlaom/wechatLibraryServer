/**
 * 管理员注册
 */
var fs = require('fs');
var path = require('path');
var sha1 = require('sha1');
var express = require('express');
var recommend = require('../public/js/recommend');
var router = express.Router();

var UserModel = require('../models/users');
var checkNotLogin = require('../middlewares/check').checkNotLogin;

// GET /signup 注册页
router.get('/', function (req, res, next) {
    console.log(req.query);
});

// POST /signup 用户注册
router.post('/', function (req, res, next) {
    console.log("用户注册");
    var userId = req.fields.userId;
    var phone = req.fields.phone;
    var idCard = req.fields.idCard;

    console.log(userId + " " + phone + " " + idCard);
    function isCardID(sId) {
        var iSum = 0;
        if (!/^\d{17}(\d|x)$/i.test(sId)) return "你输入的身份证长度或格式错误";
        sId = sId.replace(/x$/i, "a");
        var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
        var d = new Date(sBirthday.replace(/-/g, "/"));
        if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()))return "身份证上的出生日期非法";
        for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
        if (iSum % 11 != 1) return "你输入的身份证号非法";
        return false;
    }

    function checkMobile(sMobile) {
        if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
            return false;
        } else {
            return true;
        }

    }

    var user = {
        userId: userId,
        phone: phone,
        idCard: idCard
    };

    try {
        if (!userId) {
            throw new Error('获取用户名失败');
        }
        if (!checkMobile(phone)) {
            throw new Error('电话号码有误');
        }
        if (isCardID(idCard)) {
            throw new Error(isCardID(idCard));
        }

    }catch (e){
        return res.send(e.message);
    }
    // 用户信息写入数据库
    function setUser(oneuser, callback) {
        var feedback = 'null';
        UserModel.create(oneuser)
            .then(function () {
                feedback = 'success';
                if (callback && typeof(callback) === "function") {
                    callback(feedback);
                }
                recommend.recommendFunction(userId);//首次推荐
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

// 判断用户是否存在
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
                console.log("Exist");
                res.send("exist");
            }
        });
});

module.exports = router;
