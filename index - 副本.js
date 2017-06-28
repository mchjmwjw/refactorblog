var path = require('path');
var express = require('express');
var app = express();

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');

app.set('views', path.join(__dirname, 'views'));// 设置存放模板的路径
app.set('view engine', 'ejs');// 设置模板引擎为ejs

app.use('/', indexRouter);
app.use('/users', userRouter);

// middleware mounted without a path will be executed for every request to the app.
// 其他请求全部抛出异常
app.use(function(req, res, next) {
    next(new Error());
});

//异常接收
app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Error: 发生了错误!');
})

app.listen(3000);