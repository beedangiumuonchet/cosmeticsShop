var express = require('express');
var router = express.Router();
var fs = require('fs'); // Đọc file JSON

/* GET Trang chủ */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Trang Chủ', user: req.cookies.user || null });
});

// Hiển thị trang đăng nhập
router.get('/login', function(req, res) {
    res.render('login'); 
});

// Hiển thị trang đăng ký
router.get('/signup', function(req, res) {
    res.render('signup'); 
});

// API trả về danh sách sản phẩm
router.get('/api/products', function(req, res) {
  fs.readFile('public/data/products.json', (err, data) => {
      if (err) {
          res.status(500).json({ error: "Lỗi đọc dữ liệu" });
      } else {
          res.json(JSON.parse(data));
      }
  });
});

// Hiển thị trang sản phẩm
router.get('/products', function(req, res) {
  res.render('products', { user: req.cookies.user || null });
});

// ✅ Sửa lỗi: Dùng `router.get()` thay vì `app.get()`
router.get('/cart', function(req, res) {
  res.render('cart', { user: req.cookies.user || null });
});

module.exports = router;
