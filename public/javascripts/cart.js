document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Dữ liệu giỏ hàng:", cart);

    const cartItemsContainer = document.getElementById("cart-items");
    if (!cartItemsContainer) {
        console.error("Không tìm thấy phần tử có ID 'cart-items'. Kiểm tra lại file cart.ejs.");
        return;
    }

    function loadCart() {
        cartItemsContainer.innerHTML = "";

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<tr><td colspan='5'>Giỏ hàng trống.</td></tr>";
            document.getElementById("cart-total").textContent = "0";
            return;
        }

        let total = 0;
        cart.forEach((item, index) => {
            if (!item.price || isNaN(item.price)) {
                console.error(`Lỗi: Sản phẩm ${item.name} không có giá hợp lệ`, item);
                return;
            }

            let itemTotal = item.price * (item.quantity || 1);
            total += itemTotal;

            cartItemsContainer.innerHTML += `
                <tr>
                    <td>
                        <img src="${item.image || '/images/default.png'}" alt="${item.name}" width="50" height="50">
                        ${item.name}
                    </td>
                    <td>${item.price.toLocaleString()} VND</td>
                    <td>
                        <div class="quantity-controls">
                            <button class="btn-quantity" onclick="changeQuantity(${index}, -1)">−</button>
                            <span class="quantity">${item.quantity || 1}</span>
                            <button class="btn-quantity" onclick="changeQuantity(${index}, 1)">+</button>
                        </div>
                    </td>
                    <td>${itemTotal.toLocaleString()} VND</td>
                    <td><button class="btn-remove" onclick="removeItem(${index})">❌</button></td>
                </tr>
            `;
        });

        document.getElementById("cart-total").textContent = total.toLocaleString();
        updateCartCount();
    }

    function updateCartCount() {
        let totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
        document.getElementById("cart-count").textContent = totalItems;
    }

    window.changeQuantity = (index, amount) => {
        if (cart[index]) {
            cart[index].quantity += amount;
            if (cart[index].quantity < 1) {
                cart.splice(index, 1);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
        }
    };

    window.removeItem = (index) => {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart();
    };

    loadCart();
});
