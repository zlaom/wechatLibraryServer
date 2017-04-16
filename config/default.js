module.exports = {
  port: 3000,
  session: {
    secret: 'library',
    key: 'library',
    maxAge: 2592000000
  },
  mongodb: 'mongodb://localhost:27017/library'
};
