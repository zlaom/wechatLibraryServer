var request = require("request")
var fs = require('fs');
var path = require('path');
var express = require('express');
var BookModel = require('../../models/books');
var SortModel = require('../../models/sorts');

// JSON to be passed to the QPX Express API
var requestData = {
    "request": {
        "slice": [
            {
                "origin": "ZRH",
                "destination": "DUS",
                "date": "2014-12-02"
            }
        ],
        "passengers": {
            "adultCount": 1,
            "infantInLapCount": 0,
            "infantInSeatCount": 0,
            "childCount": 0,
            "seniorCount": 0
        },
        "solutions": 2,
        "refundable": false
    }
};
var url=[];
for(var i=0;i<100;i++) {

    var si = i + 1210531;
    url [i]= "https://api.douban.com/v2/book/" + si;
}
for( x in url ) {
// QPX REST API URL (I censored my api key)
// fire request
    request({
        url: url[x],
        method: "POST",
        json: true,
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(requestData)
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            var bookSorts= ['语文','英语','数学','物理','化学','生物','小说','科学','计算机','电工'];
            var bookSort=[];
            console.log(body);
            bookSort[0]=bookSorts[parseInt(Math.random()*3)];
            bookSort[1]=bookSorts[parseInt(Math.random()*3)+3];
            bookSort[2]=bookSorts[parseInt(Math.random()*4)+6];
             //console.log(body);
            var book = {
                bookId: body.isbn13,
                bookTitle: body.title,
                bookCover: body.images.small,
                bookAuthor: body.author[0],
                bookPress: body.publisher,
                bookSorts: bookSort,
                bookAbstract: body.summary,
                bookNum: parseInt(parseInt(Math.random()*10)+10),
                bookCan: parseInt(parseInt(Math.random()*10)),
                bookBowNum: parseInt(parseInt(Math.random()*1000))
            };
            console.log(book);
            BookModel.create(book);


        }
        else {

            console.log("error: " + error);
            //console.log("response.statusCode: " + response.statusCode);
            console.log("response.statusText: " + response.statusText)
        }
    })
}

SortModel.showSorts().then(function (sorts) {
    sorts.forEach(function (sort) {
        BookModel.getBooksBySort(sort.sortName).then(function (books) {
            SortModel.updateSortById(sort._id,{sortBkNum:books.length});
            console.log(sort.sortName);
            console.log(books.length);
        })
    })
});