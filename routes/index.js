module.exports = function (app) {

    // 设置页面路由
    app.use('/signup', require('./signup'));
    app.use('/signin', require('./signin'));
    app.use('/signout', require('./signout'));
    app.use('/bookSignup', require('./bookSignup'));
    app.use('/library', require('./library'));
    app.use('/personal', require('./personal'));
    app.use('/search', require('./search'));
    app.use('/sortSignup', require('./sortSignup'));
    app.use('/managerSignup', require('./managerSignup'));

    app.use('/books', require('./books'));
    app.use('/users', require('./users'));
    app.use('/sorts', require('./sorts'));

    // 404 page
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.status(404).render('404');
        }
    });
};
