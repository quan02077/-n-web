const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//getusers: lấy dữ liệu từ localstorage
function getUsers() {
    let users = localStorage.getItem('users');
    if (users) {
        return JSON.parse(users);
    } else {
        return [];
    }
}

//saveusers: lưu dữ liệu vào localstorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

//showforgotform: hiển thị form quên mật khẩu
function showForgotForm() {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('forgotForm').classList.remove('d-none');
    document.getElementById('pageTitle').innerText = 'Quên mật khẩu';
}

//showloginform: hiển thị form đăng nhập
function showLoginForm() {
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('forgotForm').classList.add('d-none');
    document.getElementById('loginForm').classList.remove('d-none');
    document.getElementById('pageTitle').innerText = 'Đăng nhập';

    document.getElementById('forgotForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('passBox').classList.add('d-none');
    document.getElementById('passBox').classList.remove('d-flex');
    document.getElementById('forgotBtn').innerText = 'Kiểm tra';
}

//showregisterform: hiển thị form đăng ký
function showRegisterForm() {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('forgotForm').classList.add('d-none');
    document.getElementById('registerForm').classList.remove('d-none');
    document.getElementById('pageTitle').innerText = 'Đăng ký';
}

//initmockdata: khởi tạo dữ liệu mẫu nếu chưa có
function initMockData() {
    if (!localStorage.getItem('users')) {
        let initialUsers = [
            { email: 'quan02077@gmail.com', username: 'Minh Quan', password: '123456', role: 'Nhân viên' },
            { email: 'A123@gmail.com', username: 'Nguyen Van A', password: '123456', role: 'Khách hàng' },
        ];
        saveUsers(initialUsers);
    }
}
initMockData();

//login: xử lý đăng nhập
function login() {
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value;
    let role = document.getElementById('roleSelection').value;
    let users = getUsers();

    let userExists = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) { userExists = true; break; }
    }

    if (!emailValidation.test(username) && !userExists) {
        Swal.fire('Sai định dạng', 'Vui lòng nhập đúng định dạng email hoặc username.', 'warning');
        return;
    }

    let user = null;
    for (let i = 0; i < users.length; i++) {
        if ((users[i].username === username || users[i].email === username) &&
            users[i].password === password &&
            users[i].role === role) {
            user = users[i];
            break;
        }
    }

    if (user != null) {
        Swal.fire({
            title: 'Xin chào!',
            text: 'Đăng nhập thành công',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = "homePage.html";
        });
    } else {
        Swal.fire('Thất bại', 'Tên đăng nhập, mật khẩu hoặc quyền không đúng.', 'error');
        document.getElementById('password').value = '';
    }
}

//forgotpassword: xử lý quên mật khẩu
function forgotPassword() {
    let username = document.getElementById('forgotUsername').value.trim();
    let newPass = document.getElementById('newPassword').value;
    let confirmPass = document.getElementById('confirmPassword').value;
    let passBox = document.getElementById('passBox');

    let users = getUsers();

    let index = -1;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username || users[i].email === username) {
            index = i;
            break;
        }
    }

    if (index === -1) {
        Swal.fire('Lỗi', 'Tài khoản không tồn tại. Vui lòng kiểm tra lại!', 'error');
        return;
    }

    if (passBox.classList.contains('d-none')) {
        Swal.fire({
            title: 'Xác thực thành công',
            text: 'Tài khoản hợp lệ. Vui lòng nhập mật khẩu mới bên dưới.',
            icon: 'success',
            confirmButtonColor: '#111'
        });
        passBox.classList.remove('d-none');
        passBox.classList.add('d-flex');
        document.getElementById('forgotBtn').innerText = 'Xác nhận thay đổi';
        return;
    }

    if (newPass === "" || confirmPass === "") {
        Swal.fire('Thông báo', 'Vui lòng nhập đầy đủ mật khẩu mới!', 'warning');
        return;
    }

    if (newPass === confirmPass) {
        users[index].password = newPass;
        saveUsers(users);
        Swal.fire({
            title: 'Thành công',
            text: 'Mật khẩu của em đã được cập nhật!',
            icon: 'success',
            confirmButtonColor: '#111'
        }).then(() => {
            showLoginForm();
        });
    } else {
        Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp. Thử lại nhé!', 'error');
    }
}

//register: xử lý đăng ký tài khoản
function register() {
    let email = document.getElementById('registerEmail').value.trim();
    let username = document.getElementById('registerUsername').value.trim();
    let password = document.getElementById('registerPassword').value;
    let confirmPassword = document.getElementById('registerConfirmPassword').value;
    let role = document.getElementById('registerRoleSelection').value;

    let users = getUsers();

    if (!emailValidation.test(email)) {
        Swal.fire('Định dạng sai', 'Vui lòng nhập đúng địa chỉ email!', 'warning');
        return;
    }

    if (password !== confirmPassword) {
        Swal.fire('Lỗi', 'Mật khẩu xác nhận không khớp nhau!', 'error');
        return;
    }

    let isDuplicate = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username || users[i].email === email) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        Swal.fire('Đã tồn tại', 'Email hoặc tên đăng nhập này đã có người dùng rồi!', 'error');
        return;
    }

    let newUser = {
        email: email,
        username: username,
        password: password,
        role: role
    };
    users.push(newUser);
    saveUsers(users);

    Swal.fire({
        title: 'Chúc mừng!',
        text: 'Em đã đăng ký tài khoản thành công.',
        icon: 'success',
        confirmButtonColor: '#111'
    }).then(() => {
        showLoginForm();
    });
}

//togglepassword: ẩn hiện mật khẩu trên các ô input
function togglePassword(checkbox) {
    let form = checkbox.closest("form");
    if (!form) return;
    let passwords = form.querySelectorAll(".password-field");

    for (let j = 0; j < passwords.length; j++) {
        if (checkbox.checked) {
            passwords[j].type = "text";
        } else {
            passwords[j].type = "password";
        }
    }
}

//initusersession: hiển thị tài khoản khi đăng nhập thành công
function initUserSession() {
    let currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
        let currentUser = JSON.parse(currentUserData);
        let userAccountText = document.getElementById('userAccountText');
        let userIconImg = document.getElementById('userIconImg');
        let userAccountLink = document.getElementById('userAccountLink');

        if (userAccountText && userIconImg && userAccountLink) {
            userAccountText.innerText = currentUser.username;
            userIconImg.src = "hinhAnh/userHomeIcon.png";
            userAccountLink.href = "#";
        }
    }
}
// Chạy hàm kiểm tra session ngay
initUserSession();

//renderhotproducts: tải động 8 sản phẩm hot trên trang chủ từ kho hàng
function renderHotProducts() {
    let container = document.getElementById('hotProductsContainer');
    if (!container) return;

    let allProds = (typeof getAllProducts === 'function') ? getAllProducts() : (typeof productsDatabase !== 'undefined' ? productsDatabase : []);
    let hotProds = allProds.filter(p => p.badge && p.badge !== "");

    if (hotProds.length < 8) {
        let normalProds = allProds.filter(p => !p.badge || p.badge === "");
        for (let i = 0; i < normalProds.length; i++) {
            if (hotProds.length >= 8) break;
            hotProds.push(normalProds[i]);
        }
    }

    let displayProds = hotProds.slice(0, 8);
    let htmlContent = "";
    displayProds.forEach(p => {
        let priceFormat = p.price.toLocaleString('vi-VN') + ' đ';
        htmlContent += `
            <div class="col-6 col-md-3">
                <a href="productDetail.html?id=${p.id}" class="text-decoration-none text-dark">
                    <div class="product-card border p-3 rounded shadow-sm text-center" style="height: 100%; transition: all 0.3s ease;">
                        <div style="height: 180px; display: flex; align-items: center; justify-content: center; overflow: hidden; margin-bottom: 15px;">
                            <img src="${p.img}" class="img-fluid" style="max-height: 100%; object-fit: contain;">
                        </div>
                        <h5 class="fw-bold" style="font-size: 16px; min-height: 40px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; line-height: 1.3;">${p.name}</h5>
                        <p class="text-danger fw-bold" style="font-size: 18px; margin-bottom: 8px;">${priceFormat}</p>
                        <button class="btn btn-dark w-100">Xem chi tiết</button>
                    </div>
                </a>
            </div>
        `;
    });
    container.innerHTML = htmlContent;
}
renderHotProducts();

//handleenterkey: nhấn enter để kích hoạt form
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        let loginForm = document.getElementById('loginForm');
        let registerForm = document.getElementById('registerForm');
        let forgotForm = document.getElementById('forgotForm');

        if (loginForm && !loginForm.classList.contains('d-none')) {
            event.preventDefault();
            document.getElementById('loginBtn').click();
        } else if (registerForm && !registerForm.classList.contains('d-none')) {
            event.preventDefault();
            document.getElementById('registerBtn').click();
        } else if (forgotForm && !forgotForm.classList.contains('d-none')) {
            event.preventDefault();
            document.getElementById('forgotBtn').click();
        }
    }
}
document.addEventListener('keydown', handleEnterKey);

//clearform: xóa dữ liệu cũ trong form khi tải trang
function clearForm() {
    let loginForm = document.getElementById('loginForm');
    let registerForm = document.getElementById('registerForm');
    let forgotForm = document.getElementById('forgotForm');

    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    if (forgotForm) forgotForm.reset();
}
window.onload = clearForm;

//togglemenu: đóng mở menu 3 gạch
function toggleMenu() {
    let menu = document.querySelector('.menu');
    if (menu) {
        if (menu.classList.contains('active')) {
            menu.classList.remove('active');
        } else {
            menu.classList.add('active');
        }
    }
}

//checkpaymentsuccess: hiện thông báo khi thanh toán thành công
function checkPaymentSuccess() {
    let urlParams = new URLSearchParams(window.location.search);
    let isPaymentSuccess = urlParams.get('payment_success');
    let orderId = urlParams.get('order_id');

    if (isPaymentSuccess === 'true' && orderId) {
        let orders = JSON.parse(localStorage.getItem('basau_orders')) || [];
        let orderFound = false;

        for (let i = 0; i < orders.length; i++) {
            if (orders[i].id === orderId) {
                if (orders[i].status !== 'Đã thanh toán 🟢') {
                    orders[i].status = 'Đã thanh toán 🟢';
                    orderFound = true;
                }
                break;
            }
        }

        if (orderFound) {
            localStorage.setItem('basau_orders', JSON.stringify(orders));
            Swal.fire({
                title: 'Thanh toán thành công!',
                text: 'Tuyệt vời! Đơn hàng ' + orderId + ' của bạn đã được xác nhận.',
                icon: 'success',
                confirmButtonColor: '#27ae60'
            }).then(handlePaymentAlertClose);
        }
    }
}

function handlePaymentAlertClose() {
    window.history.replaceState(null, null, window.location.pathname);
}
checkPaymentSuccess();

//timer: đếm ngược ở homepage
const targetDate = new Date("Jun 13 2026 00:00:00").getTime();

function timer() {
    let Days = document.getElementById('days');
    let Hours = document.getElementById('hours');
    let Minutes = document.getElementById('minutes');
    let Seconds = document.getElementById('seconds');

    if (!Days || !Hours || !Minutes || !Seconds) return;

    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / 1000 / 60 / 60 / 24);
    const hours = Math.floor(distance / 1000 / 60 / 60) % 24;
    const minutes = Math.floor(distance / 1000 / 60) % 60;
    const seconds = Math.floor(distance / 1000) % 60;

    Days.innerHTML = days + ' <small class="d-block fs-6 fw-normal">Ngày</small>';
    Hours.innerHTML = hours + ' <small class="d-block fs-6 fw-normal">Giờ</small>';
    Minutes.innerHTML = minutes + ' <small class="d-block fs-6 fw-normal">Phút</small>';
    Seconds.innerHTML = seconds + ' <small class="d-block fs-6 fw-normal">Giây</small>';

    if (distance < 0) {
        Days.innerHTML = "00 <small class='d-block fs-6 fw-normal'>Ngày</small>";
        Hours.innerHTML = "00 <small class='d-block fs-6 fw-normal'>Giờ</small>";
        Minutes.innerHTML = "00 <small class='d-block fs-6 fw-normal'>Phút</small>";
        Seconds.innerHTML = "00 <small class='d-block fs-6 fw-normal'>Giây</small>";
    }
}
setInterval(timer, 1000);

//handlegeneralsearch: xử lý tìm kiếm chung chuyển hướng đến trang danh mục
function handleGeneralSearch(e, input) {
    if (e.key === 'Enter') {
        e.preventDefault();
        let keyword = input.value.trim();
        if (keyword !== "") {
            window.location.href = "catalog.html?search=" + encodeURIComponent(keyword);
        }
    }
}
