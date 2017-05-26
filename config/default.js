module.exports = {
    port:3000,
/*    port1: 3000,//http
    port2: 3001,//https*/
    session: {
        secret: 'library',
        key: 'library',
        maxAge: 2592000000
    },
    mongodb: 'mongodb://localhost:27017/library'
};
