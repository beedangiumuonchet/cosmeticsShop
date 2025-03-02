document.addEventListener("DOMContentLoaded", () => {
    // Xử lý đăng ký
    const signupForm = document.getElementById("signupForm");
    if (signupForm) {
        signupForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let username = document.getElementById("signupUsername").value.trim();
            let password = document.getElementById("signupPassword").value.trim();

            let users = JSON.parse(localStorage.getItem("users")) || [];
            if (users.some(user => user.username === username)) {
                document.getElementById("signupError").textContent = "Tài khoản đã tồn tại!";
            } else {
                users.push({ username, password });
                localStorage.setItem("users", JSON.stringify(users));
                alert("Đăng ký thành công!");
                window.location.href = "/login";
            }
        });
    }

    // Xử lý đăng nhập
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let username = document.getElementById("loginUsername").value.trim();
            let password = document.getElementById("loginPassword").value.trim();

            let users = JSON.parse(localStorage.getItem("users")) || [];
            let user = users.find(user => user.username === username && user.password === password);

            if (user) {
                localStorage.setItem("loggedInUser", username); // Lưu trạng thái đăng nhập
                alert("Đăng nhập thành công!");
                window.location.href = "/"; // Chuyển về trang chủ
            } else {
                document.getElementById("loginError").textContent = "Sai tài khoản hoặc mật khẩu!";
            }
        });
    }

    // Cập nhật navbar khi đã đăng nhập
    function updateNavbar(username) {
        const loginButton = document.querySelector(".btn-login");
        const userDropdown = document.querySelector(".user-dropdown");
        const dropdownUsername = document.getElementById("dropdown-username");

        if (username) {
            loginButton.style.display = "none"; // Ẩn nút đăng nhập
            userDropdown.style.display = "inline-block"; // Hiện dropdown user
            dropdownUsername.textContent = username; // Gán username
        }
    }

    // Kiểm tra trạng thái đăng nhập
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
        updateNavbar(loggedInUser);
    }

    // Xử lý sự kiện click vào user để mở/đóng dropdown
    const userDropdown = document.querySelector(".user-dropdown");
    const dropdownMenu = document.querySelector(".dropdown-menu");

    if (userDropdown) {
        // Hiện dropdown khi click vào user
        userDropdown.addEventListener("click", (event) => {
            event.stopPropagation(); // Ngăn chặn sự kiện click lan ra ngoài
            dropdownMenu.style.display = dropdownMenu.style.display === "block" ? "none" : "block";
        });

        // Hiện dropdown khi hover
        userDropdown.addEventListener("mouseenter", () => {
            dropdownMenu.style.display = "block";
        });

        // Ẩn dropdown khi di chuột ra ngoài user-dropdown
        userDropdown.addEventListener("mouseleave", () => {
            dropdownMenu.style.display = "none";
        });

        // Ẩn dropdown khi click ra ngoài
        document.addEventListener("click", (event) => {
            if (!userDropdown.contains(event.target)) {
                dropdownMenu.style.display = "none";
            }
        });
    }
});
