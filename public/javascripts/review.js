document.addEventListener("DOMContentLoaded", function () {
    const reviewButtons = document.querySelectorAll(".btn-review");
    
    reviewButtons.forEach(button => {
        button.addEventListener("click", function (event) {
            event.stopPropagation(); // Ngăn chặn sự kiện lan ra phần tử cha
            const orderId = this.getAttribute("data-order-id");
            if (orderId) {
                window.location.href = `/review/${orderId}`;
            } else {
                console.error("Không tìm thấy orderId cho nút này.");
            }
        });
    });
});
