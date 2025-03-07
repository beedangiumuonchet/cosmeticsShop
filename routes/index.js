var express = require('express');
var router = express.Router();
var fs = require('fs'); // Đọc file JSON
const path = require('path');

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


// Đọc dữ liệu từ file orders.json
router.get('/orders', function(req, res) {
  const filePath = path.join(__dirname, '../public/data/orders.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
      let orders = [];
      
      if (!err) {
          try {
              orders = JSON.parse(data);  // Đọc JSON
          } catch (parseError) {
              console.error("❌ Lỗi parse JSON:", parseError);
          }
      } else {
          console.error("❌ Lỗi đọc file:", err);
      }

      console.log("✅ Orders data:", orders); // Debug orders
      res.render('orders', { orders: orders, user: req.cookies.user || null });
  });
});

// Route hiển thị đơn hàng
router.get('/orders', function(req, res) {
  res.render('orders', { user: req.cookies.user || null });
});
router.post('/review/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const { reviews } = req.body; // Mảng đánh giá cho từng sản phẩm

  // Lưu các đánh giá (tùy vào cách bạn xử lý, có thể ghi vào JSON hoặc cơ sở dữ liệu)
  console.log('Đánh giá cho đơn hàng:', orderId, reviews);

  // Quay về trang danh sách đơn hàng
  res.redirect('/orders');
});


router.get('/review/:orderId', (req, res) => {
  const orderId = req.params.orderId;
  const filePath = path.join(__dirname, '../public/data/orders.json');

  // Đọc tệp JSON để lấy thông tin đơn hàng
  fs.readFile(filePath, 'utf8', (err, data) => {
      let orders = [];
      let order = null;

      if (!err) {
          try {
              orders = JSON.parse(data);  // Đọc JSON
              // Tìm đơn hàng với orderId tương ứng
              order = orders.find(o => o.order_id == orderId);
          } catch (parseError) {
              console.error("❌ Lỗi parse JSON:", parseError);
          }
      } else {
          console.error("❌ Lỗi đọc file:", err);
      }

      // Kiểm tra nếu đơn hàng không tồn tại
      if (!order) {
          return res.status(404).send("Đơn hàng không tìm thấy");
      }

      console.log("✅ Order details:", order); // Debug order
      res.render('review', { order: order, user: req.cookies.user || null });
  });
});


router.get('/review/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // Đọc file review.json
    fs.readFile(reviewFilePath, 'utf8', (err, data) => {
        let reviews = [];
        if (!err) {
            try {
                reviews = JSON.parse(data);
            } catch (parseError) {
                console.error("❌ Lỗi parse JSON:", parseError);
            }
        } else {
            console.error("❌ Lỗi đọc file:", err);
        }

        // Tìm review theo orderId
        const orderReview = reviews.find(review => review.order_id === parseInt(orderId));

        // Nếu có đánh giá, truyền thông tin sản phẩm và đánh giá vào view
        const products = orderReview ? orderReview.reviews : [];
        res.render('review', { orderId, products });
    });
});

router.post('/review/:orderId', (req, res) => {
    const orderId = req.params.orderId;

    // Đọc dữ liệu từ review.json
    fs.readFile(reviewFilePath, 'utf8', (err, data) => {
        let reviews = [];
        if (!err) {
            try {
                reviews = JSON.parse(data);
            } catch (parseError) {
                console.error("❌ Lỗi parse JSON:", parseError);
            }
        } else {
            console.error("❌ Lỗi đọc file:", err);
        }

        // Kiểm tra xem đơn hàng đã có đánh giá chưa
        let orderReview = reviews.find(review => review.order_id === parseInt(orderId));

        if (!orderReview) {
            // Nếu chưa có đánh giá, tạo mới
            orderReview = {
                order_id: parseInt(orderId),
                reviews: []
            };
            reviews.push(orderReview);
        }

        // Cập nhật đánh giá cho từng sản phẩm
        const products = req.body;  // Dữ liệu đánh giá từ form

        for (const productId in products) {
            if (products.hasOwnProperty(productId)) {
                const productReview = {
                    product_id: parseInt(productId),
                    rating: parseInt(products[`rating_${productId}`]),
                    comment: products[`comment_${productId}`] || '',
                    images: req.files ? req.files[`images_${productId}`] : []
                };

                // Kiểm tra xem sản phẩm đã có đánh giá chưa
                const existingReview = orderReview.reviews.find(review => review.product_id === parseInt(productId));
                if (existingReview) {
                    // Cập nhật đánh giá nếu đã có
                    existingReview.rating = productReview.rating;
                    existingReview.comment = productReview.comment;
                    existingReview.images = productReview.images;
                } else {
                    // Thêm mới đánh giá cho sản phẩm
                    orderReview.reviews.push(productReview);
                }
            }
        }

        // Ghi lại đánh giá vào review.json
        fs.writeFile(reviewFilePath, JSON.stringify(reviews, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error("❌ Lỗi ghi vào file review.json:", writeErr);
                return res.status(500).send("Không thể lưu đánh giá.");
            }

            console.log("✅ Đánh giá đã được lưu!");
            res.redirect(`/review/${orderId}`);  // Điều hướng lại trang đánh giá
        });
    });
});


module.exports = router;
