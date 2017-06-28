var path = require('path');
var express = require('express');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var flash = require('connect-flash');
var config = require('config-lite')(__dirname);
var routes = require('./routes');
var pkg = require('./package');

var app = express();

// 设置模板目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎为ejs
app.set('view engine', 'ejs');
// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')));
// session 中间件
app.use(session({
    name: config.session.key,        // 设置cookie中保存session id 的字段名称
    secret: config.session.secret,   // 通过设置secret来计算hash值并放在cookie中，使产生的signedCookie放篡改
    resave: true,                    // 强制更新session
    saveUninitialized: false,        // 设置为false, 强制创建一个session, 即使用户未登录
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后cookie中的session id自动删除
    },
    store: new MongoStore({ // 将session存储到mongodb
        url: config.mongodb // mongodb地址
    })
}));
// flash中间件，用来显示通知
app.use(flash());
// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
	uploadDir: path.join(__dirname, 'public/img'), 	// 上传文件目录
	keepExtensions: true							// 保留后缀
}));


// 设置模板全局变量 （渲染模板优先级: res.render传入的对象 > res.locals对象 > app.locals对象）
app.locals.blog = {
	title: pkg.name,
	description: pkg.description
}
// 添加模板必须的3个变量
app.use(function (req, res, next) {
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
});
// 这样在调用 res.render 的时候就不用传入这四个变量了，express 为我们自动 merge 并传入了模板，所以我们可以在模板中直接使用这四个变量

//路由
routes(app);

//监听端口，启动程序
app.listen(config.port, function() {
    console.log(`${pkg.name} listening on port ${config.port}`);
});

// config-lite 手动配置
// var config = require('config-lite')({
//     filename: 'test',
//     config_basedir: __dirname,
//     config_dir: 'config'
// });
