document.addEventListener("DOMContentLoaded", () => {
    const loginButton = document.querySelector(".btn-login");
    const userDropdown = document.querySelector(".user-dropdown");
    const usernameDisplay = document.getElementById("dropdown-username");
    const dropdownMenu = document.querySelector(".dropdown-menu");
    const logoutBtn = document.getElementById("logout-btn");
    const productGrid = document.getElementById("productGrid");
    let allProducts = []; // Lưu danh sách sản phẩm

    // Kiểm tra user đăng nhập
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        updateNavbar(loggedInUser);
    } else {
        loginButton.style.display = "inline-block";
    }

    function updateNavbar(username) {
        loginButton.style.display = "none";
        userDropdown.style.display = "inline-block";
        usernameDisplay.textContent = username;

        document.getElementById("username-display").addEventListener("click", (event) => {
            event.preventDefault();
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", (event) => {
            if (!userDropdown.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }

    // Xử lý đăng xuất
    logoutBtn?.addEventListener("click", (event) => {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "/login";
    });

    // Lấy danh sách sản phẩm từ JSON
    async function fetchProducts() {
        try {
            const response = await fetch("/data/products.json");
            allProducts = await response.json();
            displayProducts(allProducts);
            updateCartCount(); // Cập nhật số lượng giỏ hàng khi tải sản phẩm
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
    }

    // Hiển thị danh sách sản phẩm
    function displayProducts(products) {
        productGrid.innerHTML = "";
        if (products.length === 0) {
            productGrid.innerHTML = "<p>Không tìm thấy sản phẩm phù hợp.</p>";
            return;
        }

        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Giá: ${product.price.toLocaleString()} VND</p>
                <button class="add-to-cart" data-id="${product.id}">🛒 Thêm vào giỏ</button>
                <button class="view-details" data-id="${product.id}">Xem Chi Tiết</button>
            `;
            productGrid.appendChild(productCard);
        });

        document.getElementById("productGrid").addEventListener("click", function (event) {
            if (event.target.classList.contains("add-to-cart")) {
                const productId = parseInt(event.target.getAttribute("data-id")); // Chuyển ID về dạng số
                addToCart(productId);
            }
        });
    }
// Cập nhật số lượng giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (!Array.isArray(cart)) {
        console.error("Lỗi: Cart không phải là mảng!", cart);
        localStorage.removeItem("cart");
        return;
    }

    const cartCount = cart.reduce((total, item) => total + (item.quantity || 0), 0);

    console.log("Cập nhật số lượng giỏ hàng:", cartCount);
    
    const cartCountElement = document.getElementById("cart-count");
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    } else {
        console.error("Không tìm thấy phần tử cart-count!");
    }
}

    // Thêm vào giỏ hàng
    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let existingItem = cart.find(item => item.id === productId);
    
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            const product = allProducts.find(p => p.id === productId);
            if (!product) {
                console.error(`Không tìm thấy sản phẩm với ID ${productId}`);
                return;
            }
    
            cart.push({ 
                id: product.id, 
                name: product.name, 
                price: product.price, 
                quantity: 1,
                image: product.image || "/images/default.png"  // 🔹 Đảm bảo có ảnh
            });
        }
    
        localStorage.setItem("cart", JSON.stringify(cart));
    }
        

    

    // Lọc sản phẩm
    function filterProducts() {
        if (!allProducts.length) return;

        const category = document.getElementById("category").value;
        const brand = document.getElementById("brand").value;
        const priceRange = document.getElementById("price").value;

        let filteredProducts = [...allProducts];

        if (category !== "all") {
            filteredProducts = filteredProducts.filter(p => p.category === category);
        }

        if (brand !== "all") {
            filteredProducts = filteredProducts.filter(p => p.brand === brand);
        }

        if (priceRange !== "all") {
            filteredProducts = filteredProducts.filter(p => {
                const price = p.price;
                if (priceRange === "low") return price < 500000;
                if (priceRange === "mid") return price >= 500000 && price <= 1000000;
                if (priceRange === "high") return price > 1000000;
                return true;
            });
        }

        displayProducts(filteredProducts);
    }

    // Gán sự kiện lọc
    document.getElementById("category").addEventListener("change", filterProducts);
    document.getElementById("brand").addEventListener("change", filterProducts);
    document.getElementById("price").addEventListener("change", filterProducts);

    // Gọi hàm tải sản phẩm
    fetchProducts();
});
