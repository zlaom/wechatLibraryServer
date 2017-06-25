/**
 * Created by 14798 on 2017/6/23.
 */
var fs = require('fs');
var path = require('path');
var express = require('express');
var moment = require('moment');
var router = express.Router();
var SortModel = require('../models/sorts');// 分类模型

var checkLogin = require('../middlewares/check').checkLogin;

// 获得所有分类
router.get('/', function (req, res, next) {
    SortModel.showSorts().then(function (sorts) {
        res.render('sorts', {
            sorts: sorts
        });
    }).catch(next);
});

// GET /sorts/:sortId/edit 更新类别页面
router.get('/:sortId/sortEdit', checkLogin, function(req, res, next) {
    var sortId = req.params.sortId;

    SortModel.getSortBySortId(sortId)
        .then(function (sort) {
            if (!sort) {
                throw new Error('该分类不存在');
            }
            res.render('sortEdit', {
                sort: sort
            });
        })
        .catch(next);
});

// POST /sorts/:sortId/sortEdit 更新一本书
router.post('/:sortId/sortEdit', checkLogin, function(req, res, next) {
    // 获取变量值
    var sortId=req.params.sortId;
    var sortName=req.fields.sortName;
    var sortEname=req.fields.sortEname;
    var sortBkNum= 0;
    if(req.files.sortCover.size>0){
        var sortCover = req.files.sortCover.path.split(path.sep).pop();
    }

    //模板赋值
    var sort = {
        sortName: sortName,
        sortBkNum: sortBkNum,
        sortEname:sortEname
    };
    if(sortCover){
        console.log('增加');
        sort.sortCover=sortCover;
    }
    SortModel.updateSortById(sortId,sort)
        .then(function () {
            console.log("成功");
            req.flash('success', '编辑分类成功');
            // 编辑成功后跳转到上一页
            res.redirect(`/sorts/${sortId}/sortEdit`);
        })
        .catch(next);
});


// GET /sorts/:sortId/remove 删除一个分类
router.get('/:sortId/remove', checkLogin, function(req, res, next) {
    var sortId = req.params.sortId;
    SortModel.delSortById(sortId)
        .then(function () {
            req.flash('success', '删除分类成功');
            // 删除成功后跳转到书籍管理
            res.redirect('/sorts');
        })
        .catch(next);
});

module.exports = router;