function getCheckoutCartKey() {
    let userData = localStorage.getItem('currentUser');
    let user = userData ? JSON.parse(userData) : null;
    return (user && user.username) ? 'basau_cart_' + user.username : 'basau_cart_guest';
}
let dataTinhThanh = [];

// Hàm gọi API
function fetchProvinces() {
    fetch('https://provinces.open-api.vn/api/?depth=3')
        .then(response => response.json())
        .then(data => {
            dataTinhThanh = data; // Cất vào tủ lạnh xài dần
            renderCities();       // Gọi hàm vẽ danh sách Tỉnh
        })
        .catch(error => console.error("Lỗi tải Tỉnh thành:", error));
}

// Hàm vẽ danh sách Tỉnh/Thành
function renderCities() {
    let citySelect = document.getElementById('citySelect');
    let html = '<option value="" selected disabled>Chọn Tỉnh / Thành</option>';
    
    // Lặp qua mảng dataTinhThanh để tạo thẻ <option>
    for (let i = 0; i < dataTinhThanh.length; i++) {
        html += `<option value="${dataTinhThanh[i].code}">${dataTinhThanh[i].name}</option>`;
    }
    citySelect.innerHTML = html;
}

// Bắt sự kiện khi khách chọn Tỉnh -> Mở ô Quận
document.getElementById('citySelect').addEventListener('change', function() {
    let cityCode = this.value; // Lấy mã Tỉnh khách vừa chọn
    let districtSelect = document.getElementById('districtSelect');
    let wardSelect = document.getElementById('wardSelect');
    
    // Tìm Tỉnh đó trong mảng dữ liệu gốc
    let selectedCity = dataTinhThanh.find(tinh => tinh.code == cityCode);
    
    let html = '<option value="" selected disabled>Chọn Quận / Huyện</option>';
    for (let i = 0; i < selectedCity.districts.length; i++) {
        html += `<option value="${selectedCity.districts[i].code}">${selectedCity.districts[i].name}</option>`;
    }
    
    districtSelect.innerHTML = html;
    districtSelect.disabled = false; // Mở khóa ô Quận
    
    // Reset lại ô Phường
    wardSelect.innerHTML = '<option value="" selected disabled>Chọn Phường / Xã</option>';
    wardSelect.disabled = true; 
});

// Bắt sự kiện khi khách chọn Quận -> Mở ô Phường
document.getElementById('districtSelect').addEventListener('change', function() {
    let districtCode = this.value;
    let cityCode = document.getElementById('citySelect').value;
    let wardSelect = document.getElementById('wardSelect');
    
    // Tìm Quận đó nằm trong Tỉnh nào
    let selectedCity = dataTinhThanh.find(tinh => tinh.code == cityCode);
    let selectedDistrict = selectedCity.districts.find(quan => quan.code == districtCode);
    
    let html = '<option value="" selected disabled>Chọn Phường / Xã</option>';
    for (let i = 0; i < selectedDistrict.wards.length; i++) {
        html += `<option value="${selectedDistrict.wards[i].code}">${selectedDistrict.wards[i].name}</option>`;
    }
    
    wardSelect.innerHTML = html;
    wardSelect.disabled = false; // Mở khóa ô Phường
});

// Chạy API ngay khi mở trang
document.addEventListener('DOMContentLoaded', function() {
    fetchProvinces();
});

emailjs.init("ZKkt1SbaCMqURDFyM"); 

document.addEventListener('DOMContentLoaded', function() {
    // Đợi 100ms để đảm bảo trình duyệt đã sẵn sàng
    setTimeout(loadCheckoutSummary, 100);

    const form = document.getElementById('checkoutForm');
    if (form) {
        form.onsubmit = function(event) {
            event.preventDefault();
            processCheckout();
        };
    }
});

function loadCheckoutSummary() {
    // Lấy dữ liệu từ localStorage
    let cartData = localStorage.getItem(getCheckoutCartKey());  
    let cart = cartData ? JSON.parse(cartData) : [];
    
    let itemsContainer = document.getElementById('checkoutItems');
    let totalContainer = document.getElementById('checkoutTotal');
    let btnSubmit = document.getElementById('btnSubmitOrder');

    if (!itemsContainer) return;

    if (cart.length === 0) {
        itemsContainer.innerHTML = "<p class='text-danger fw-bold'>Giỏ hàng trống! Vui lòng quay lại chọn hàng.</p>";
        if (btnSubmit) btnSubmit.disabled = true;
        return;
    }

    let tongTien = 0;
    let html = "";

    for (let i = 0; i < cart.length; i++) {
        let p = cart[i];
        let thanhTien = p.price * p.quantity;
        tongTien += thanhTien;

        html += `
            <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                <div style="flex: 1;">
                    <div class="fw-bold" style="font-size: 22px;">${p.name}</div>
                    <div class="text-secondary" style="font-size: 18px;">Size: ${p.size} | SL: ${p.quantity}</div>
                </div>
                <div class="fw-bold text-dark">${thanhTien.toLocaleString('vi-VN')}₫</div>
            </div>
        `;
    }
    
    // Thêm dòng tổng cộng vào cuối danh sách
    html += `
        <div class="d-flex justify-content-between mt-3 pt-2">
            <span class="fw-bold fs-5">TỔNG CỘNG:</span>
            <span class="fw-bold fs-4 text-danger">${tongTien.toLocaleString('vi-VN')}₫</span>
        </div>
    `;
    
    itemsContainer.innerHTML = html;
}

function processCheckout() {
    let btnSubmit = document.getElementById('btnSubmitOrder');
    btnSubmit.innerText = "ĐANG XỬ LÝ...";
    btnSubmit.disabled = true;

    try {
        let customerName = document.getElementById('cusName').value;
        let customerEmail = document.getElementById('cusEmail').value;
        let sdtKhach = document.getElementById('cusPhone').value; 
        
        let citySelect = document.getElementById('citySelect');
        let districtSelect = document.getElementById('districtSelect');
        let wardSelect = document.getElementById('wardSelect');
        let homeInput = document.getElementById('homeAddress').value;

        let cityName = citySelect.options[citySelect.selectedIndex].text;
        let districtName = districtSelect.options[districtSelect.selectedIndex].text;
        let wardName = wardSelect.options[wardSelect.selectedIndex].text;

        let diaChiHoanChinh = `${homeInput}, ${wardName}, ${districtName}, ${cityName}`;
        
        let cart = JSON.parse(localStorage.getItem(getCheckoutCartKey())) || [];
        if (cart.length === 0) {
            Swal.fire('Giỏ hàng trống', 'Vui lòng chọn sản phẩm trước khi thanh toán!', 'warning');
            btnSubmit.innerText = "CHẤP NHẬN THANH TOÁN";
            btnSubmit.disabled = false;
            return;
        }

        let tongTien = 0;
        let orderDetails = "";
        for (let i = 0; i < cart.length; i++) {
            tongTien += (cart[i].price * cart[i].quantity);
            orderDetails += `- ${cart[i].name} (Size: ${cart[i].size}) x ${cart[i].quantity}\n`;
        }
        let orderId = "ORD" + new Date().getTime(); 
        let baseUrl = window.location.origin + window.location.pathname.replace('checkout.html', 'homePage.html');
        let paymentLink = baseUrl + "?payment_success=true&order_id=" + orderId;

        let templateParams = {
            to_name: customerName,
            to_email: customerEmail,
            order_list: orderDetails,
            total_price: tongTien.toLocaleString('vi-VN') + " VND",
            phone: sdtKhach,   
            address: diaChiHoanChinh,
            payment_link: paymentLink
        };

        emailjs.send('service_ai9ja1y', 'template_qt0fk2b', templateParams)
            .then(function() {
                let orders = JSON.parse(localStorage.getItem('basau_orders')) || [];
                orders.push({
                    id: orderId,
                    customer: customerName,
                    email: customerEmail,
                    phone: sdtKhach,
                    address: diaChiHoanChinh,
                    total: tongTien,
                    date: new Date().toLocaleString('vi-VN'),
                    status: 'Chờ thanh toán 🟡'
                });
                localStorage.setItem('basau_orders', JSON.stringify(orders));

                Swal.fire({
                    title: 'Đặt hàng thành công!',
                    text: 'Vui lòng kiểm tra Email và bấm nút Thanh toán để hoàn tất đơn hàng nhé.',
                    icon: 'success',
                    confirmButtonColor: '#111'
                }).then(() => {
                    localStorage.setItem(getCheckoutCartKey(), JSON.stringify([]));
                    window.location.href = "homePage.html"; 
                });
            }, function(error) {
                Swal.fire('Lỗi hệ thống', 'Không gửi được email. Vui lòng thử lại!', 'error');
                btnSubmit.innerText = "CHẤP NHẬN THANH TOÁN";
                btnSubmit.disabled = false;
            });

    } catch (err) {
        Swal.fire('Thiếu thông tin', 'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã!', 'warning');
        btnSubmit.innerText = "CHẤP NHẬN THANH TOÁN";
        btnSubmit.disabled = false;
    }
}
