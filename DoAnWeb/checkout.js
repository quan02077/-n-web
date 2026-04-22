// 1. KHỞI TẠO EMAILJS (Nhớ thay Public Key của em vào đây nha!)
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
    let cartData = localStorage.getItem('basau_cart');
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
                    <div class="fw-bold" style="font-size: 14px;">${p.name}</div>
                    <div class="text-secondary" style="font-size: 12px;">Size: ${p.size} | SL: ${p.quantity}</div>
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

    // --- ĐÃ SỬA LỖI: LẤY ĐẦY ĐỦ 4 THÔNG TIN KHÁCH HÀNG ---
    let customerName = document.getElementById('cusName').value;
    let customerEmail = document.getElementById('cusEmail').value;
    let sdtKhach = document.getElementById('cusPhone').value; 
    let diaChi = document.getElementById('cusAddress').value; 
    
    let cart = JSON.parse(localStorage.getItem('basau_cart')) || [];
    let tongTien = 0;
    let orderDetails = "";
    
    for (let i = 0; i < cart.length; i++) {
        tongTien += (cart[i].price * cart[i].quantity);
        orderDetails += `- ${cart[i].name} (Size: ${cart[i].size}) x ${cart[i].quantity}\n`;
    }

    let templateParams = {
        to_name: customerName,
        to_email: customerEmail,
        order_list: orderDetails,
        total_price: tongTien.toLocaleString('vi-VN') + " VND",
        phone: sdtKhach,   
        address: diaChi
    };

    // Service ID và Template ID của em đã chuẩn rồi
    emailjs.send('service_ai9ja1y', 'template_qt0fk2b', templateParams)
        .then(function() {
            alert("✅ ĐẶT HÀNG THÀNH CÔNG!\nHóa đơn đã được gửi vào email: " + customerEmail);
            localStorage.setItem('basau_cart', JSON.stringify([])); 
            window.location.href = "homePage.html"; 
        }, function(error) {
            alert("❌ Lỗi: Không gửi được email. Bạn đã điền đúng Public Key chưa?");
            console.log("Chi tiết lỗi:", error);
            btnSubmit.innerText = "CHẤP NHẬN THANH TOÁN";
            btnSubmit.disabled = false;
        });
}