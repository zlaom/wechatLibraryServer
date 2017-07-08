/**
 * Created by 14798 on 2017/7/7.
 */
var BookModel = require('../../models/books');
var SortModel = require('../../models/sorts');

SortModel.showSorts().then(function (sorts) {
   sorts.forEach(function (sort) {
       BookModel.getBooksBySort(sort.sortName).then(function (books) {
           SortModel.updateSortById(sort._id,{sortBkNum:books.length});
           console.log(sort.sortName);
           console.log(books.length);
       })
   })
});