const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Lấy users từ LocalStorage
function getUsers() {
    let users = localStorage.getItem('users');
    if (users) {
        return JSON.parse(users);
    } else {
        return [];
    }
}

// Lưu users vào LocalStorage
function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function showForgotForm() {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('registerForm').classList.add('d-none');
    document.getElementById('forgotForm').classList.remove('d-none');
    document.getElementById('pageTitle').innerText = 'Quên mật khẩu';
}

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

function showRegisterForm() {
    document.getElementById('loginForm').classList.add('d-none');
    document.getElementById('forgotForm').classList.add('d-none');
    document.getElementById('registerForm').classList.remove('d-none');
    document.getElementById('pageTitle').innerText = 'Đăng ký';
}

// Khởi tạo CSDL mẫu nếu chưa có
if (!localStorage.getItem('users')) {
    let initialUsers = [
        { email: 'quan02077@gmail.com', username: 'Minh Quan', password: '123456', role: 'Nhân viên' },
        { email: 'A123@gmail.com', username: 'Nguyen Van A', password: '123456', role: 'Khách hàng' },
    ];
    saveUsers(initialUsers);
}

// Đăng nhập
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

// Quên mật khẩu
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

// Đăng ký
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

// Ẩn và hiện mật khẩu
let checkboxes = document.querySelectorAll("input[type='checkbox'][id^='showPass']");
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", function () {
        let form = checkboxes[i].closest("form");
        let passwords = form.querySelectorAll(".password-field");

        for (let j = 0; j < passwords.length; j++) {
            if (checkboxes[i].checked) {
                passwords[j].type = "text";
            } else {
                passwords[j].type = "password";
            }
        }
    });
}

// Hiển thị tài khoản khi đăng nhập thành công
document.addEventListener('DOMContentLoaded', function () {
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
});

// Nhấn Enter
document.addEventListener('keydown', function (event) {
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
});

// Clear form
window.onload = function () {
    let loginForm = document.getElementById('loginForm');
    let registerForm = document.getElementById('registerForm');
    let forgotForm = document.getElementById('forgotForm');

    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    if (forgotForm) forgotForm.reset();
};

// Menu 3 gạch
document.addEventListener("DOMContentLoaded", function () {
    let menuToggle = document.querySelector('.menu-toggle');
    let menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            } else {
                menu.classList.add('active');
            }
        });
    }
});
//hiện thông báo khi thanh toán thành công
document.addEventListener('DOMContentLoaded', function () {
    let urlParams = new URLSearchParams(window.location.search);
    let isPaymentSuccess = urlParams.get('payment_success');
    let orderId = urlParams.get('order_id');

    if (isPaymentSuccess === 'true' && orderId) {
        let orders = JSON.parse(localStorage.getItem('basau_orders')) || [];
        let orderFound = false;

        // Tìm đơn hàng và cập nhật trạng thái
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
            }).then(() => {
                // Xóa rác trên thanh địa chỉ để không bị F5 hiện lại
                window.history.replaceState(null, null, window.location.pathname);
            });
        }
    }
});

//Đếm ngược ở homePage
const Days = document.getElementById('days');
const Hours = document.getElementById('hours');
const Minutes = document.getElementById('minutes');
const Seconds = document.getElementById('seconds');

const targetDate = new Date("Jun 13 2026 00:00:00").getTime();

function timer() {
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

