// ============================================================
// HỆ THỐNG TÀI KHOẢN (BẢN TÁCH RỜI CSS)
// ============================================================

function injectAccountHTML() {
    if (document.getElementById('accPanel')) return;

    let overlay = document.createElement('div');
    overlay.id = 'accOverlay';
    overlay.onclick = closeAccountPanel;

    let panel = document.createElement('div');
    panel.id = 'accPanel';

    panel.innerHTML = `
        <div class="panel-header">
            <div>
                <h5 class="panel-title">👤 TÀI KHOẢN</h5>
                <p id="accHeaderRole" class="panel-subtitle green">Khách hàng</p>
            </div>
            <button onclick="closeAccountPanel()" class="panel-close-btn">✕</button>
        </div>
        <div class="panel-body">
            
            <h6 class="acc-section-title">THÔNG TIN CÁ NHÂN</h6>
            <div class="mb-3">
                <label class="form-label small text-secondary fw-bold">Họ và tên hiển thị</label>
                <input type="text" id="accEditName" class="form-control bg-light" placeholder="Nhập tên của bạn">
            </div>
            
            <div class="mb-3">
                <label class="form-label small text-secondary fw-bold">Địa chỉ Email</label>
                <input type="email" id="accEditEmail" class="form-control bg-light" placeholder="emailcuaban@gmail.com">
            </div>

            <div class="mb-4">
                <label class="form-label small text-secondary fw-bold">Quyền hạn (Chỉ xem)</label>
                <input type="text" id="accEditRole" class="form-control text-muted bg-light" disabled>
            </div>
            <button onclick="saveAccountInfo()" class="btn btn-dark w-100 fw-bold mb-4">LƯU THÔNG TIN MỚI</button>

            <h6 class="acc-section-title">BẢO MẬT</h6>
            <div class="mb-3">
                <label class="form-label small text-secondary fw-bold">Mật khẩu mới</label>
                <input type="password" id="accNewPass" class="form-control" placeholder="Nhập mật khẩu muốn đổi">
            </div>
            <button onclick="changeAccountPassword()" class="btn btn-outline-dark w-100 fw-bold mb-5">CẬP NHẬT MẬT KHẨU</button>

            <button onclick="logoutUser()" class="btn btn-danger w-100 fw-bold py-2 mt-auto rounded-pill">ĐĂNG XUẤT</button>

            <button onclick="viewMyOrders()" class="btn btn-outline-primary w-100 fw-bold mb-4 mt-3">LỊCH SỬ MUA HÀNG</button>
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
}

function openAccountPanel() {
    let userData = localStorage.getItem('currentUser');
    if (!userData || userData === "null") {
        window.location.href = "login.html";
        return;
    }

    let user = JSON.parse(userData);
    
    document.getElementById('accEditName').value = user.username || "";
    document.getElementById('accEditEmail').value = user.email || ""; 
    document.getElementById('accEditRole').value = user.role || "Khách hàng";
    document.getElementById('accHeaderRole').innerText = user.role || "Khách hàng";
    document.getElementById('accNewPass').value = ""; 

    document.getElementById('accPanel').classList.add('open');
    document.getElementById('accOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeAccountPanel() {
    document.getElementById('accPanel').classList.remove('open');
    document.getElementById('accOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function saveAccountInfo() {
    let newName = document.getElementById('accEditName').value.trim();
    let newEmail = document.getElementById('accEditEmail').value.trim();

    if (newName === "" || newEmail === "") {
        Swal.fire('Khoan đã', 'Vui lòng không để trống Tên và Email nhé!', 'warning'); 
        return;
    }
    if (!newEmail.includes("@")) {
        Swal.fire('Lỗi định dạng', 'Email không hợp lệ!', 'error'); 
        return;
    }

    let user = JSON.parse(localStorage.getItem('currentUser'));
    user.username = newName;
    user.email = newEmail; 
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    let accText = document.getElementById('userAccountText');
    if(accText) accText.innerText = newName;

    Swal.fire('Tuyệt vời', 'Đã cập nhật Tên và Email thành công!', 'success');
}

function changeAccountPassword() {
    let newPass = document.getElementById('accNewPass').value.trim();
    if (newPass.length < 3) {
        Swal.fire('Lưu ý', 'Mật khẩu mới phải từ 3 ký tự trở lên nha.', 'info'); 
        return;
    }
    let user = JSON.parse(localStorage.getItem('currentUser'));
    user.password = newPass;
    localStorage.setItem('currentUser', JSON.stringify(user));
    document.getElementById('accNewPass').value = "";
    
    Swal.fire('Thành công', 'Đã đổi mật khẩu mới!', 'success');
}

function logoutUser() {
    Swal.fire({
        title: 'Đăng xuất?',
        text: "Bạn có chắc chắn muốn thoát khỏi hệ thống?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#111',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.removeItem('currentUser');
            window.location.href = "homePage.html";
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    injectAccountHTML();
    
    let accLink = document.getElementById('userAccountLink');
    let accText = document.getElementById('userAccountText');

    let userData = localStorage.getItem('currentUser');
    if (userData && userData !== "null" && userData !== "undefined") {
        let user = JSON.parse(userData);
        if (accText && user.username) {
            accText.innerText = user.username;
        }
    }

    if (accLink) {
        accLink.addEventListener('click', function(e) {
            let checkData = localStorage.getItem('currentUser');
            if (checkData && checkData !== "null" && checkData !== "undefined") {
                e.preventDefault(); 
                openAccountPanel();
            }
        });
    }
});