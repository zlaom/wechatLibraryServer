/**
 * 实现websocket给特定用户发送消息的方法。
 * @type {*}
 */
var users = [];
var i = 0;

module.exports = {
    websocket: function websocket(wss) {
        wss.on('connection', function connection(socket) {
            console.log("有新客户端连接!");
            // 构造客户端对象
            var newclient = {
                socket: socket,
                name: false
            };
            socket.on('message', function incoming(msg) {
                // 判断是不是第一次连接，以第一条消息作为用户名
                if (!newclient.name) {
                    newclient.name = msg;
                    users[i++]=newclient;
                    console.log(users);
                    console.log(newclient.name + "已经连接服务器");
                }
            });

            socket.on('close', function close() {
                console.log(newclient.name + "与服务器断开连接");
                users.splice(users.indexOf(newclient),1);//删除对象
                i--;
                console.log(users);
            });
        });
    },
    sendUseMsg:function sendUseMsg(name,msg) {
        users.forEach(function user(user){
            if(user.name==name){
                user.socket.send(msg);
            }
        })
    }

};
