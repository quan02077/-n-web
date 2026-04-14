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
    
    // Kiểm tra xem tên đăng nhập có tồn tại không bằng vòng lặp for
    let userExists = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            userExists = true;
            break;
        }
    }

    if (!emailValidation.test(username) && !userExists) {
        alert('Vui lòng nhập đúng định dạng email hoặc username.');
        return;
    }

    // Tìm user hợp lệ bằng vòng lặp for (cách cơ bản)
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
    let newPass = document.getElementById('newPassword').value;
    let confirmPass = document.getElementById('confirmPassword').value;
    let passBox = document.getElementById('passBox');
    
    let users = getUsers();
    
    // Tìm vị trí của user bằng vòng lặp for
    let index = -1;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username || users[i].email === username) {
            index = i;
            break;
        }
    }

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

    if (newPass === "" || confirmPass === "") {
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

    // Kiểm tra trùng lặp bằng vòng lặp
    let isDuplicate = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username || users[i].email === email) {
            isDuplicate = true;
            break;
        }
    }

    if (isDuplicate) {
        alert('Email hoặc username đã tồn tại.');
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

    alert('Đăng ký thành công!');
    showLoginForm();
}

// Ẩn và hiện mật khẩu
let checkboxes = document.querySelectorAll("input[type='checkbox'][id^='showPass']");
for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener("change", function() {
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
document.addEventListener('DOMContentLoaded', function() {
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
            userAccountLink.addEventListener('click', function(event) {
                event.preventDefault();
                let confirmLogout = confirm("Bạn có muốn đăng xuất không?");
                if (confirmLogout) {
                    localStorage.removeItem('currentUser'); 
                    window.location.reload(); 
                }
            });
        }
    }
});

// Nhấn Enter
document.addEventListener('keydown', function(event) {
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
window.onload = function() {
    let loginForm = document.getElementById('loginForm');
    let registerForm = document.getElementById('registerForm');
    let forgotForm = document.getElementById('forgotForm');

    if (loginForm) loginForm.reset();
    if (registerForm) registerForm.reset();
    if (forgotForm) forgotForm.reset();
};

// Menu 3 gạch
document.addEventListener("DOMContentLoaded", function() {
    let menuToggle = document.querySelector('.menu-toggle');
    let menu = document.querySelector('.menu');

    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            } else {
                menu.classList.add('active');
            }
        });
    }
});
function changeImage(element) {
    const mainImg = document.getElementById('mainProductImg');
    mainImg.src = element.src;
    document.querySelectorAll('.thumbnail-list img').forEach(img => img.classList.remove('active-thumb'));
    element.classList.add('active-thumb');
}

function selectColor(element) {
    document.querySelectorAll('.color-thumb').forEach(img => img.classList.remove('active-color'));
    element.classList.add('active-color');
}

function addToBag() {
    const selectedSize = document.querySelector('.size-btn.active-size');
    const productName = document.getElementById('productName').innerText;

    if (!selectedSize) {
        alert("Vui lòng chọn Size trước khi thêm vào giỏ hàng!");
        return;
    }
    alert(`Thành công! Đã thêm ${productName} - Size ${selectedSize.innerText} vào giỏ hàng.`);
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. TẢI DỮ LIỆU SẢN PHẨM DỰA TRÊN ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (typeof productsDatabase !== 'undefined' && productId) {
        const product = productsDatabase.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('productName').innerText = product.name;
            document.getElementById('productCategory').innerText = product.category;
            document.getElementById('productPrice').innerText = product.price;
            document.getElementById('mainProductImg').src = product.mainImage;
            document.title = `${product.name} - Basau Sneakers`;

            // Cập nhật Thumbnails
            const thumbContainer = document.getElementById('thumbnailContainer');
            thumbContainer.innerHTML = '';
            product.thumbnails.forEach((thumb, index) => {
                let activeClass = index === 0 ? 'active-thumb' : '';
                thumbContainer.innerHTML += `<img src="${thumb}" class="img-thumbnail ${activeClass}" onclick="changeImage(this)">`;
            });

            // Cập nhật Colors
            const colorContainer = document.getElementById('colorContainer');
            colorContainer.innerHTML = ''; 
            product.colors.forEach((color, index) => {
                let activeClass = index === 0 ? 'active-color' : '';
                colorContainer.innerHTML += `<img src="${color}" class="color-thumb border ${activeClass}" onclick="selectColor(this)">`;
            });
        } else {
            document.getElementById('productName').innerText = "Sản phẩm không tồn tại";
        }
    }

    // 2. CHỌN SIZE
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active-size'));
            this.classList.add('active-size');
        });
    });
});