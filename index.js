var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite');
var routes = require('./routes');
var pkg = require('./package');
var winston = require('winston');
var expressWinston = require('express-winston');
var http = require('http');
var https = require('https');
var io = require('socket.io')(http);
const fs = require('fs');
const WebSocket = require('ws');
var websocket = require('./public/js/webSocket');//web
// 轮询消息提醒机制
var cycle = require('./public/js/cycle');
/*var re=require('./public/js/recommend');
re.recommendFunction('Vtrust');*/

var app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({server});
websocket.websocket(wss);
/*
const wss = new WebSocket.Server({ server });
var users=[];
var i=0;

wss.on('connection', function connection(socket) {
    console.log("有新客户端连接!");

    // 构造客户端对象
    var newclient = {
        socket:socket,
        name:false
    };
    socket.on('message', function incoming(msg) {
        var currentTime = getTime();
        // 判断是不是第一次连接，以第一条消息作为用户名
        if(!newclient.name){
            newclient.name = msg;
            users[i++]=newclient;
            console.log(users);
            wss.clients.forEach(function each(client) {
/!*                if (client.readyState === WebSocket.OPEN) {
                    client.send("welcome_系统管理员_" + currentTime + "_欢迎" + msg + "加入聊天！");
                }*!/
            });
            console.log(newclient.name + "加入连接。");
        }
        else{
            var client=msg.client;
            var data=msg.data;
           /!* console.log( wss.clients);*!/
            users.forEach(function each(user) {
                if(user.name=='vtrust'){
                    user.socket.send("管理员"+msg);
                }
            });
/!*            wss.clients.forEach(function each(client) {
                if (client !== socket && client.readyState === WebSocket.OPEN) {
                    client.send("other_" + newclient.name + "_" + currentTime + "_" + msg);
                }
                else if(client == socket){
                    client.send("self_" + newclient.name + "_" + currentTime + "_" + msg);
                }
                console.log(newclient.name + "于" + currentTime + "说：" + msg);
            });*!/
        }
    });

    socket.on('close', function close() {
        var currentTime = getTime();
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send("leave_系统管理员_" + currentTime + "_" + newclient.name + "断开了连接");
            }
            console.log(newclient.name + "离开聊天。");
        });
    });
});

var getTime=function(){
    var date = new Date();
    return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
};














*/




/*
// 本地HTTPS测试
const credentials = {
    key: fs.readFileSync('path/to/privatekey.pem'),
    cert: fs.readFileSync('path/to/certificate.pem')
};
var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);
*/

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));

// 设置模板引擎为 ejs
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));

// session 中间件
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    resave: true,// 强制更新 session
    saveUninitialized: false,// 设置为 false，强制创建一个 session，即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    },
    store: new MongoStore({// 将 session 存储到 mongodb
        url: config.mongodb// mongodb 地址
    })
}));

// flash 中间件，用来显示通知
app.use(flash());

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
    uploadDir: path.join(__dirname, 'public/img'),// 上传文件目录
    keepExtensions: true// 保留后缀
}));

// 设置模板全局常量
app.locals.library = {
    title: pkg.name,
    description: pkg.description
};

// 添加模板必需的三个变量
app.use(function (req, res, next) {
    res.locals.user = req.session.user;
    res.locals.success = req.flash('success').toString();
    res.locals.error = req.flash('error').toString();
    next();
});

// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}));

// 路由
routes(app);

// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}));

// error page
app.use(function (err, req, res, next) {
    res.render('error', {
        error: err
    });
});
server.listen(3001, function listening() {
    console.log('Listening on %d', server.address().port);
});
/*
if (module.parent) {
    module.exports = app;
} else {
    // 监听端口，启动程序
    const port = process.env.PORT || config.port;
    app.listen(port, function () {
        console.log(`${pkg.name} listening on port ${port}`);
    });
}
*/

/*
// herokun部署使用
 if (module.parent) {
 module.exports = app;
 } else {
 // 监听端口，启动程序
 httpServer.listen(config.port1, function () {
 console.log(`${pkg.name} listening on port ${config.port1}`);
 });
 httpsServer.listen(config.port2, function () {
 console.log(`${pkg.name} listening on port ${config.port2}`);
 });
 }
 */
/*
var websocket = require('./public/js/webSocket');*/
cycle.remind();