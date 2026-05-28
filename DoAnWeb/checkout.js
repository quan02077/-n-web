let dataTinhThanh = [];

//fetchprovinces: tải dữ liệu tỉnh thành từ api
function fetchProvinces() {
    fetch('https://provinces.open-api.vn/api/?depth=3')
        .then(response => response.json())
        .then(data => {
            dataTinhThanh = data;
            renderCities();
        })
        .catch(error => console.error("Lỗi tải Tỉnh thành:", error));
}

//rendercities: hiển thị danh sách tỉnh thành
function renderCities() {
    let citySelect = document.getElementById('citySelect');
    let html = '<option value="" selected disabled>Chọn Tỉnh / Thành</option>';

    for (let i = 0; i < dataTinhThanh.length; i++) {
        html += `<option value="${dataTinhThanh[i].code}">${dataTinhThanh[i].name}</option>`;
    }
    citySelect.innerHTML = html;
}

//handlecitychange: xử lý khi chọn tỉnh thành
function handleCityChange(select) {
    let cityCode = select.value;
    let districtSelect = document.getElementById('districtSelect');
    let wardSelect = document.getElementById('wardSelect');

    let selectedCity = dataTinhThanh.find(tinh => tinh.code == cityCode);

    let html = '<option value="" selected disabled>Chọn Quận / Huyện</option>';
    for (let i = 0; i < selectedCity.districts.length; i++) {
        html += `<option value="${selectedCity.districts[i].code}">${selectedCity.districts[i].name}</option>`;
    }

    districtSelect.innerHTML = html;
    districtSelect.disabled = false;

    wardSelect.innerHTML = '<option value="" selected disabled>Chọn Phường / Xã</option>';
    wardSelect.disabled = true;
}

//handledistrictchange: xử lý khi chọn quận huyện
function handleDistrictChange(select) {
    let districtCode = select.value;
    let cityCode = document.getElementById('citySelect').value;
    let wardSelect = document.getElementById('wardSelect');

    let selectedCity = dataTinhThanh.find(tinh => tinh.code == cityCode);
    let selectedDistrict = selectedCity.districts.find(quan => quan.code == districtCode);

    let html = '<option value="" selected disabled>Chọn Phường / Xã</option>';
    for (let i = 0; i < selectedDistrict.wards.length; i++) {
        html += `<option value="${selectedDistrict.wards[i].code}">${selectedDistrict.wards[i].name}</option>`;
    }

    wardSelect.innerHTML = html;
    wardSelect.disabled = false;
}

//loadcheckoutsummary: tải tóm tắt đơn hàng
function loadCheckoutSummary() {
    let cart = getCart();

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

    html += `
        <div class="d-flex justify-content-between mt-3 pt-2">
            <span class="fw-bold fs-5">TỔNG CỘNG:</span>
            <span class="fw-bold fs-4 text-danger">${tongTien.toLocaleString('vi-VN')}₫</span>
        </div>
    `;

    itemsContainer.innerHTML = html;
}

//processcheckout: xử lý thanh toán đơn hàng
function processCheckout(event) {
    if (event) event.preventDefault();
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

        let cart = getCart();
        if (cart.length === 0) {
            Swal.fire('Giỏ hàng trống', 'Vui lòng chọn sản phẩm trước khi thanh toán!', 'warning');
            btnSubmit.innerText = "CHẤP NHẬN THANH TOÁN";
            btnSubmit.disabled = false;
            return false;
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
            .then(function () {
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
                    saveCart([]);
                    window.location.href = "homePage.html";
                });
            }, function (error) {
                Swal.fire('Lỗi hệ thống', 'Không gửi được email. Vui lòng thử lại!', 'error');
                btnSubmit.innerText = "CHẤP NHẬN THANH TOÁN";
                btnSubmit.disabled = false;
            });

    } catch (err) {
        Swal.fire('Thiếu thông tin', 'Vui lòng chọn đầy đủ Tỉnh/Thành, Quận/Huyện, Phường/Xã!', 'warning');
        btnSubmit.innerText = "CHẤP NHẬN THANH TOÁN";
        btnSubmit.disabled = false;
    }
    return false;
}

//initcheckout: khởi tạo trang thanh toán
function initCheckout() {
    fetchProvinces();
    emailjs.init("ZKkt1SbaCMqURDFyM");
    setTimeout(loadCheckoutSummary, 100);
}
document.addEventListener('DOMContentLoaded', initCheckout);
