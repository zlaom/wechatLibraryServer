/**
 * Created by 14798 on 2017/4/13.
 */
var Book = require('../lib/mongo').Book;
var BookStatus =  require('../lib/mongo').BookStatus;

module.exports = {
    // 注册一本书
    create: function create(book) {
        return Book.create(book).exec();
    },

    // 通过bookId查找一本书
    getBookByBookId: function getBookByBookId(bookId) {
        //console.log(bookId);
        var query={bookId: bookId};
        //console.log(query);
        return Book.findOne(query);
    },

    // 查找一个分类
    getBooksBySort:function getBooksBySort(sort) {
        return Book.find({bookSorts:sort}).exec()
    },

    // 通过Sorts和bookId查找这一本书的4本相关书籍
    getRelaBooksByBookId:function getRelaBooksByBookId(Sorts,bookId){
        return Book.find({bookSorts:{$in:Sorts},bookId:{$ne:bookId}}).sort({"bookBowNum":-1}).limit(4);
        /*var query={bookId: bookId};
        console.log("bookid"+bookId);
        Book.findOne(query).then(function (book) {
            Sorts = book.bookSorts;
            return Book.find({bookSorts:{$in:Sorts},bookId:{$ne:bookId}}).sort({"bookBowNum":-1}).limit(4);
        });*/
    },

    // 通过bookId预约一本书
    bookStatus:function bookStatus(bookStatus){
        return BookStatus.create(bookStatus).exec();
    },

    // 更新书本可借数
    bookCanUpdate:function bookCanUpdate(num,bookId){
        if(num == 1){
            return Book.update({bookId:bookId},{$inc:{bookCan:1}}); // 增加可借数
        }else if(num == 0){
            Book.findOne({bookId:bookId}).then(function (book) {
                if(book.bookCan!=0){
                    return Book.update({bookId:bookId},{$inc:{bookCan:-1}});// 减少可借数
                }
            });
        }
    },

    // 根据用户和书本取消一本书的预约
    delBookStatus:function delBookStatus(userId,bookId,type) {
        return BookStatus.remove({userId:userId,bookId:bookId,type:type}).exec();
    }
};
/*
bookCover: res.data.bookCover,
    bookName: res.data.bookName,
    bookAuthor: res.data.bookAuthor,
    bookPress: res.data.bookPress,
    bookSort: res.data.bookSort,
    bookAbstract: res.data.bookAbstract,
    bookNum: res.data.bookNum,
    bookCan: res.data.bookCan*/
