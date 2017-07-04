/**
 * Created by 14798 on 2017/7/1.
 * 匹配推荐算法
 */
var BookStatus = require('../../models/bookStatus');
var Books = require('../../models/books');
var moment = require('moment');

//虚拟参数
var type = ['cancelRe', 'recommend'];//搜集数据不需要取消借阅的书
var vBooks = [
    {
        "bookId": "11111",
        "bookTitle": "书本1",
        "bookAuthor": "作者1",
        "bookPress": "出版社1",
        "bookSorts": [
            "语文",
            "科学"
        ]
    },
    {
        "bookId": "11112",
        "bookTitle": "书本2",
        "bookAuthor": "作者2",
        "bookPress": "出版社1",
        "bookSorts": [
            "小说",
            "生物"
        ]
    },
    {
        "bookId": "11113",
        "bookTitle": "书本3",
        "bookAuthor": "作者3",
        "bookPress": "出版社2",
        "bookSorts": [
            "生物",
            "语文",
            "科学"
        ]
    },
    {
        "bookId": "11114",
        "bookTitle": "书本4",
        "bookAuthor": "作者4",
        "bookPress": "出版社1",
        "bookSorts": [
            "生物",
            "语文",
            "小说"
        ]
    },
    {
        "bookId": "11116",
        "bookTitle": "书本5",
        "bookAuthor": "作者5",
        "bookPress": "出版社3",
        "bookSorts": [
            "生物",
            "语文",
            "小说"
        ]
    },
    {
        "bookId": "11117",
        "bookTitle": "书本1",
        "bookAuthor": "作者6",
        "bookPress": "出版社4",
        "bookSorts": [
            "生物",
            "科学",
            "小说"
        ]
    },
    {
        "bookId": "11118",
        "bookTitle": "书本1",
        "bookAuthor": "作者2",
        "bookPress": "出版社2",
        "bookSorts": [
            "语文",
            "科学"
        ]
    },
    {
        "bookId": "11119",
        "bookTitle": "书本8",
        "bookAuthor": "作者1",
        "bookPress": "出版社3",
        "bookSorts": [
            "生物",
            "科学"
        ]
    }
];//模拟数据

//初始设定
// 用户最近数据量
var userDataNum = 10;// 推荐根据的数量量
// 返回结果数量
var bookNum = 5;//返回的推荐书籍数量
// 书籍数据库查找设置
var pLimit = 10;//每次查找数量


// 权值设定
var wBookName = 5;//书名
var wAuthor = 4;//作者
var wSort = 3;//分类

// 权值排序
function down(x, y) {
    return (x.Sample < y.Sample) ? 1 : -1
}
// 一次搜函数
function oneceRecommend(userId, skip, then) {
    console.log('执行');
    // 获取必要匹配信息
    var BookId = [];
    var idTemp = false;
    var BookName = [];
    var nameTemp = false;
    var Author = [];
    var authorTemp = false;
    var BookPress = [];
    var pressTemp = false;
    var Sort = [];
    var sortTemp = false;
    var tBooks = [];
    BookStatus.findLimitNotType(userId, type, userDataNum).then(function (uBooks) {
        uBooks.forEach(function (book) {
            //判断不同的书名
            for (var i = 0; i < BookName.length; i++) {
                if (BookName[i] == book.bookTitle) {
                    nameTemp = true;
                    break;
                }
            }
            if (!nameTemp) {
                BookName.push(book.bookTitle);
            }
            nameTemp = false;

            //判断不同的作者
            for (var i = 0; i < Author.length; i++) {
                if (Author[i] == book.bookAuthor) {
                    authorTemp = true;
                    break;
                }
            }
            if (!authorTemp) {
                Author.push(book.bookAuthor);
            }
            authorTemp = false;

            //判断不同的出版社
            for (var i = 0; i < BookPress.length; i++) {
                if (BookPress[i] == book.bookPress) {
                    pressTemp = true;
                    break;
                }
            }
            if (!pressTemp) {
                BookPress.push(book.bookPress);
            }
            pressTemp = false;


            // 判断不同的类别
            for (var j = 0; j < book.bookSorts.length; j++) {
                for (var i = 0; i < Sort.length; i++) {
                    if (Sort[i] == book.bookSorts[j]) {
                        sortTemp = true;
                        break;
                    }
                }
                if (!sortTemp) {
                    Sort.push(book.bookSorts[j])
                }
                sortTemp = false;
            }


        });
        BookStatus.findNotType(userId, type, userDataNum).then(function (obj1) {
            var idTemp2 = false;
            // 获取不能选择的bookId
            for (var i = 0; i < obj1.length; i++) {
                for (var j = 0; j < BookId.length; j++) {
                    if (obj1[i].bookId == BookId[j]) {
                        idTemp2 = true;
                    }
                }
                if (!idTemp2) {
                    BookId.push(obj1[i].bookId);
                }
                idTemp2 = false;
            }
            // 开始查找推荐书籍

            Books.findSortBrow(skip, pLimit).then(function (obj) {
                /* console.log(obj);*/
                for (var j = 0; j < obj.length; j++) {
                    //先检查id值
                    for (var m = 0; m < BookId.length; m++) {
                        if (obj[j].bookId == BookId[m]) {
                            idTemp = true;
                            break;
                        }
                    }
                    if (idTemp) {
                        idTemp = false;
                        continue;
                    }
                    //开始权值计算
                    obj[j].Sample = 0;
                    for (var m = 0; m < BookName.length; m++) {//书名匹配
                        if (obj[j].bookTitle == BookName[m]) {
                            obj[j].Sample = obj[j].Sample + wBookName;
                            break;
                        }
                    }
                    for (var m = 0; m < Author.length; m++) {// 作者匹配
                        if (obj[j].bookAuthor == Author[m]) {
                            obj[j].Sample = obj[j].Sample + wAuthor;
                            break;
                        }
                    }
                    for (var n = 0; n < obj[j].bookSorts.length; n++) {// 分类匹配
                        for (var m = 0; m < Sort.length; m++) {
                            if (obj[j].bookSorts[n] == Sort[m]) {
                                obj[j].Sample = obj[j].Sample + wSort;
                            }
                        }
                    }
                    //权值计算完毕，写入books
                    tBooks.push(obj[j]);
                    console.log('写入');

                }
                setTimeout(function () {
                    console.log('BookId');
                    console.log(BookId);
                    console.log('BookName');
                    console.log(BookName);
                    console.log('Author');
                    console.log(Author);
                    console.log('BookPress');
                    console.log(BookPress);
                    console.log('Sort');
                    console.log(Sort);
                    console.log('tBooks');
                    console.log(tBooks);
                    then(tBooks);
                }, 50);

                /* console.log(tBooks);*/
            });

        });
    });

}

module.exports = {
    recommendFunction: function recommendFunction(userId) {
        var skip = 0;
        var books = [];
        oneceRecommend(userId, skip, test);
        function test(res) {
            if (res.length > 0) {
                res.forEach(function (book) {
                    books.push(book);
                });
                books.sort(down);
            }

            if (books.length < bookNum && res.length > 0) {
                skip += pLimit;//更新跳跃值
                oneceRecommend(userId, skip, test);
            } else {
                console.log('books');
                console.log(books);
                BookStatus.findOneTypeByUserId(userId, 'recommend').then(function (status) {
                    var temp;//执行标志位
                    console.log('status.length');
                    console.log(status.length);
                    if (status.length == 0) {// 当原推荐数目为零时
                        temp = 1;
                    } else if (books.length >= bookNum && status.length > bookNum) {
                        temp = 2;
                    } else if (books.length >= bookNum && status.length < bookNum) {
                        temp = 3;
                    } else if (books.length < bookNum && status.length > bookNum) {
                        temp = 4;
                    } else if (books.length < bookNum && status.length <= bookNum && books.length >= status.length) {
                        temp = 5;
                    } else if (books.length < bookNum && status.length <= bookNum && books.length <= status.length) {
                        temp = 6;
                    } else {
                        temp = 7;
                    }
                    console.log('temp');
                    console.log(temp);
                    // 开始操作
                    switch (temp) {
                        case 1://当status长度为0时
                            var len;
                            if (books.length > bookNum) {//判断大小
                                len = bookNum;
                            } else {
                                len = books.length;
                            }
                            for (var i = 0; i < len; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.bookStatus(bookStatus);
                            }
                            break;
                        case 2:// 当status长度不为0，books长度大于推荐数，status长度大于推荐数
                            for (var i = 0; i < bookNum; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.allUpDataByStatusId(status[i]._id, bookStatus);
                            }
                            for (var i = bookNum; i < status.length; i++) {
                                BookStatus.delBookStatusByStatusId(status[i]._id)
                            }
                            break;
                        case 3:// 当status长度不为0，books长度大于推荐数，status长度小于推荐数
                            for (var i = 0; i < status.length; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.allUpDataByStatusId(status[i]._id, bookStatus);
                            }
                            for (var i = status.length; i < bookNum; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.bookStatus(bookStatus);
                            }
                            break;
                        case 4:// 当status长度不为0，books小于推荐数，status长度大于推荐数
                            for (var i = 0; i < books.length; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.allUpDataByStatusId(status[i]._id, bookStatus);
                            }
                            for (var i = books.length; i < status.length; i++) {
                                BookStatus.delBookStatusByStatusId(status[i]._id)
                            }
                            break;
                        case 5:// 当status长度不为0，books小于大于推荐数，status长度小于推荐数，books长度大于status长度
                            for (var i = 0; i < status.length; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.allUpDataByStatusId(status[i]._id, bookStatus);
                            }
                            for (var i = status.length; i < books.length; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.bookStatus(bookStatus);
                            }
                            break;
                        case 6:// 当status长度不为0，books小于大于推荐数，status长度小于推荐数，books长度小于status长度
                            for (var i = 0; i < books.length; i++) {
                                var bookStatus = {
                                    bookId: books[i].bookId,
                                    bookTitle: books[i].bookTitle,
                                    bookCover: books[i].bookCover,
                                    bookAuthor: books[i].bookAuthor,
                                    bookPress: books[i].bookPress,
                                    bookSorts: books[i].bookSorts,
                                    userId: userId,
                                    type: 'recommend',
                                    resources: 0,
                                    updateTime: moment().toDate(),
                                    returnTime: moment().toDate()
                                };
                                BookStatus.allUpDataByStatusId(status[i]._id, bookStatus);
                            }
                            for (var i = books.length; i < status.length; i++) {
                                BookStatus.delBookStatusByStatusId(status[i]._id)
                            }
                            break;
                        default:
                            break;
                    }
                });
            }
        }
    }
};




