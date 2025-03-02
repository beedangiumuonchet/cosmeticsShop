document.addEventListener("DOMContentLoaded", function() {
    const loginForm = document.getElementById("login-form");
    
    if (!loginForm) {
        console.error("Không tìm thấy #login-form. Kiểm tra lại file EJS hoặc HTML!");
        return;
    }

    loginForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Ngừng gửi form

        const usernameInput = document.getElementById("username");
        if (!usernameInput) {
            console.error("Không tìm thấy #username!");
            return;
        }

        const username = usernameInput.value.trim();
        if (username === "") {
            alert("Vui lòng nhập tên đăng nhập!");
            return;
        }

        // Lưu username vào localStorage
        localStorage.setItem("loggedInUser", username);

        // Chuyển hướng tới trang sản phẩm
        window.location.href = "/products";
    });
});
