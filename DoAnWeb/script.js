const emailValidation = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Lấy users từ LocalStorage
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
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
    document.getElementById('passBox').classList.add('d-none'); // Ẩn passBox đi
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
        { email: 'quan02077@gmail.com', username: 'Minh Quan', password: '123456', role: 'Nhân viên'},
        { email: 'A123@gmail.com', username: 'Nguyen Van A', password: '123456', role: 'Khách hàng'},
    ];
    saveUsers(initialUsers);
}

// Đăng nhập
function login() {
    let username = document.getElementById('username').value.trim();
    let password = document.getElementById('password').value;
    let role = document.getElementById('roleSelection').value;
    let users = getUsers();
    
    if(!emailValidation.test(username) && !users.some(u => u.username === username)) {
        alert('Vui lòng nhập đúng định dạng email hoặc username.');
        return;
    }

    let user = users.find(u => 
        (u.username === username || u.email === username) && 
        u.password === password && 
        u.role === role
    );

    if (user) {
        alert('Đăng nhập thành công!');
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.location.href = "homePage.html";
    } else {
        alert('Tên đăng nhập, mật khẩu hoặc quyền không đúng.');
        document.getElementById('password').value = '';
    }
}

// Quên mật khẩu
function forgotPassword() {
    let username = document.getElementById('forgotUsername').value.trim();
    let forgotBtn = document.getElementById('forgotBtn');
    let newPass = document.getElementById('newPassword').value;
    let confirmPass = document.getElementById('confirmPassword').value;
    let passBox = document.getElementById('passBox');
    
    let users = getUsers();
    let index = users.findIndex(u => u.username === username || u.email === username);

    if (index === -1) {
        alert('Tài khoản không tồn tại. Vui lòng kiểm tra lại.');
        return; 
    }

    if (passBox.classList.contains('d-none')) {
        alert('Tài khoản hợp lệ. Vui lòng nhập mật khẩu mới.');
        passBox.classList.remove('d-none');
        passBox.classList.add('d-flex');
        document.getElementById('forgotBtn').innerText = 'Xác nhận thay đổi';
        return;
    }

    if (!newPass || !confirmPass) {
        alert('Vui lòng nhập đầy đủ mật khẩu mới.');
        return;
    }

    if (newPass === confirmPass) {
        users[index].password = newPass; 
        saveUsers(users); 
        alert('Mật khẩu đã được cập nhật thành công!');
        showLoginForm(); 
    } else {
        alert('Mật khẩu xác nhận không khớp. Vui lòng thử lại.');
    }
}

// Đăng ký
function register(){
    let email = document.getElementById('registerEmail').value.trim();
    let username = document.getElementById('registerUsername').value.trim();
    let password = document.getElementById('registerPassword').value;
    let confirmPassword = document.getElementById('registerConfirmPassword').value;
    let role = document.getElementById('registerRoleSelection').value;

    let users = getUsers();

    if (!emailValidation.test(email)) {
        alert('Vui lòng nhập đúng định dạng email.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Mật khẩu xác nhận không khớp.');
        return;
    }

    if (users.some(u => u.username === username || u.email === email)) {
        alert('Email hoặc username đã tồn tại.');
        return;
    }

    users.push({ email, username, password, role });
    saveUsers(users);

    alert('Đăng ký thành công!');
    showLoginForm();
}
//Ẩn và hiện mật khẩu
document.querySelectorAll("input[type='checkbox'][id^='showPass']").forEach(function(checkbox){
    checkbox.addEventListener("change", function(){
        let form = checkbox.closest("form");
        let passwords = form.querySelectorAll(".password-field");

        passwords.forEach(function(input){
            input.type = checkbox.checked ? "text" : "password";
        });
    });
});
// Hiển thị tài khoản khi đăng nhập thành công
document.addEventListener('DOMContentLoaded', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    const userAccountText = document.getElementById('userAccountText');
    const userIconImg = document.getElementById('userIconImg');
    const userAccountLink = document.getElementById('userAccountLink');

    if (currentUser && userAccountText && userIconImg && userAccountLink) {
        
        userAccountText.innerText = currentUser.username;
        
        userIconImg.src = "hinhAnh/userHomeIcon.png"; 

        userAccountLink.href = "#"; 
        userAccountLink.addEventListener('click', function(event) {
            event.preventDefault();
            
            let confirmLogout = confirm("Bạn có muốn đăng xuất không?");
            if (confirmLogout) {
                localStorage.removeItem('currentUser'); 
                window.location.reload(); 
            }
        });
    }
});
// Nhấn Enter
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
            
        if (!document.getElementById('loginForm').classList.contains('d-none')) {
            document.getElementById('loginBtn').click();
        } else if (!document.getElementById('registerForm').classList.contains('d-none')) {
            document.getElementById('registerBtn').click();
        } else if (!document.getElementById('forgotForm').classList.contains('d-none')) {
            document.getElementById('forgotBtn').click();
        }
    }
});

// Clear form
window.onload = function() {
    document.getElementById('loginForm').reset();
    document.getElementById('registerForm').reset();
    document.getElementById('forgotForm').reset();
};

// --- THÊM TÍNH NĂNG MENU 3 GẠCH Ở ĐÂY ---
document.addEventListener("DOMContentLoaded", function() {
    // Tìm cái nút 3 gạch và cái thanh menu
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');

    // Nếu tìm thấy cả 2 trên trang web thì mới chạy lệnh
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            // Khi bấm vào nút, tự động bật/tắt class 'active' cho menu
            menu.classList.toggle('active');
        });
    }
});