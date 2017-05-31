/**
 * Created by 14798 on 2017/4/13.
 */

// 初始设置
var fs = require('fs');
var path = require('path');
var express = require('express');

var router = express.Router();

var SortModel = require('../models/sorts');

//GET书籍录入页面
router.get('/', function (req, res, next) {
    console.log('sortGet');
    res.render('sortSignUp');
});

// POST书籍录入路由library/bookSignup
router.post('/', function (req, res, next) {
    console.log(req);
    console.log('sortPost');
    // 获取变量值
    var sortName=req.fields.sortName;
    var sortEname=req.fields.sortEname;
    var sortCover = req.files.sortCover.path.split(path.sep).pop();
    var sortBkNum= 0;
    //模板赋值
    var sort = {
        sortName: sortName,
        sortCover: sortCover,
        sortBkNum: sortBkNum,
        sortEname:sortEname
    };

    SortModel.create(sort);//籍录入记得写纠错书
    console.log(sort);//打印模板
    res.send(sort);
});

module.exports = router;

