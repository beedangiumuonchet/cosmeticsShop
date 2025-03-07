var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index'); // Route cho trang chủ
var usersRouter = require('./routes/users'); // Route cho người dùng

var app = express();

// Cấu hình View Engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev')); // Ghi log HTTP requests
app.use(express.json()); // Hỗ trợ JSON
app.use(express.urlencoded({ extended: false })); // Hỗ trợ form data
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // Định nghĩa thư mục chứa file tĩnh (CSS, JS, ảnh)

// Định nghĩa các route
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Xử lý lỗi 404 (Not Found)
app.use(function(req, res, next) {
  res.status(404).render('error', { message: 'Trang không tồn tại!', error: {} });
});

// Xử lý lỗi chung
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

module.exports = app;
