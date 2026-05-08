// ============================================================
// HỆ THỐNG GIỎ HÀNG (ĐỒNG BỘ SIDEPANEL) - BẢN HOÀN CHỈNH 100%
// ============================================================

function injectCartHTML() {
    if (document.getElementById('cartPanel')) return;

    let overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.onclick = closeCartPanel;

    let panel = document.createElement('div');
    panel.id = 'cartPanel';
    panel.innerHTML = `
        <div class="panel-header">
            <div>
                <h5 class="panel-title">🛒 GIỎ HÀNG</h5>
                <p id="cartHeaderCount" class="panel-subtitle">0 sản phẩm</p>
            </div>
            <button onclick="closeCartPanel()" class="panel-close-btn">✕</button>
        </div>
        <div id="cartItemsContainer" class="panel-body"></div>
        <div id="cartFooter" class="panel-footer"></div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
}

function openCartPanel() {
    renderCartPanel();
    document.getElementById('cartPanel').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCartPanel() {
    document.getElementById('cartPanel').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function renderCartPanel() {
    let cart = getCart();
    let container = document.getElementById('cartItemsContainer');
    let footer = document.getElementById('cartFooter');
    let countEl = document.getElementById('cartHeaderCount');
    if (!container || !footer) return;

    let totalQty = 0, totalPrice = 0;
    cart.forEach(item => {
        totalQty += item.quantity;
        totalPrice += (item.price * item.quantity);
    });
    if (countEl) countEl.textContent = totalQty + ' sản phẩm';

    if (cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:70px 20px; color:#bbb;">
                <div style="font-size:64px; margin-bottom:18px; filter:grayscale(1);">🛒</div>
                <h5 style="color:#888;">Giỏ hàng trống</h5>
                <button onclick="closeCartPanel()" class="btn btn-dark rounded-pill mt-3 px-4 py-2 fw-bold">TIẾP TỤC MUA SẮM</button>
            </div>`;
        footer.innerHTML = '';
        return;
    }

    let htmlContent = "";
    cart.forEach((item, i) => {
        htmlContent += `
            <div class="cart-item">
                <img src="${item.img}" class="cart-item-img">
                <div style="flex:1; min-width:0;">
                    <div style="font-weight:700; font-size:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${item.name}</div>
                    <div style="color:#888; font-size:16px; margin:4px 0;">Size: ${item.size}</div>
                    <div style="color:#dc3545; font-weight:700; font-size:16px;">${(item.price * item.quantity).toLocaleString('vi-VN')}₫</div>
                    <div style="display:flex; align-items:center; gap:10px; margin-top:8px;">
                        <button class="cart-qty-btn" onclick="changeCartQty(${i}, -1)">−</button>
                        <span style="font-weight:700;">${item.quantity}</span>
                        <button class="cart-qty-btn" onclick="changeCartQty(${i}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-remove-btn" onclick="removeCartItem(${i})">✕</button>
            </div>`;
    });
    container.innerHTML = htmlContent;
    
    footer.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:16px;">
            <span style="color:#888;">Tổng cộng</span>
            <span style="font-size:22px; font-weight:800; color:#dc3545;">${totalPrice.toLocaleString('vi-VN')}₫</span>
        </div>
        <button class="btn btn-dark w-100 rounded-pill py-3 fw-bold" onclick="window.location.href='checkout.html'">TIẾN HÀNH THANH TOÁN</button>
        <button class="cart-clear-btn" onclick="clearCart()">Xóa tất cả</button>
    `;
}

function getCartKey() {
    let userData = localStorage.getItem('currentUser');
    let user = userData ? JSON.parse(userData) : null;

    if (user && user.username) {
        return 'basau_cart_' + user.username; 
    }

    return 'basau_cart_guest'; 
}

function getCart() {
    let key = getCartKey();
    return JSON.parse(localStorage.getItem(key)) || [];
}

function saveCart(cart) {
    let key = getCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
    updateCartCount();
}

function changeCartQty(index, amount) {
    let cart = getCart();
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart); 
    renderCartPanel();
}

function removeCartItem(index) {
    let cart = getCart(); 
    cart.splice(index, 1);
    saveCart(cart); 
    renderCartPanel();
}

function clearCart() {
    Swal.fire({
        title: 'Xóa giỏ hàng?',
        text: "Bạn có chắc muốn xóa toàn bộ sản phẩm không?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#111',
        confirmButtonText: 'Xóa sạch',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            saveCart([]); 
            renderCartPanel(); 
            Swal.fire('Đã xóa!', 'Giỏ hàng của bạn hiện đang trống.', 'success');
        }
    });
}

function updateCartCount() {
    let cart = getCart();
    let totalQuantity = 0;
    for (let i = 0; i < cart.length; i++) totalQuantity += cart[i].quantity;

    let links = document.querySelectorAll('.tienich a');
    links.forEach(link => {
        if (link.innerHTML.includes('cartIcon') || link.innerText.includes('Giỏ hàng')) {
            link.innerHTML = `<img src="hinhAnh/cartIcon.png" width="16" class="me-1 opacity-75">Giỏ hàng (${totalQuantity})`;
        }
    });
}

// 6. KHỞI CHẠY KHI MỞ TRANG (Quan trọng nhất: Cài đặt nút bấm)
document.addEventListener('DOMContentLoaded', function () {
    injectCartHTML();
    updateCartCount();

    // 1. Kiểm tra xem có phải Admin không để hiện nút "Quản lý"
    if (typeof checkAdminAccess === 'function') {
        checkAdminAccess();
    }

    // 2. Gắn sự kiện MỞ BẢNG cho cái nút Giỏ hàng
    let links = document.querySelectorAll('.tienich a');
    links.forEach(link => {
        if (link.innerHTML.includes('cartIcon')) {
            link.onclick = function (e) {
                e.preventDefault();
                openCartPanel();
            };
        }
    });

    // 3. Gắn sự kiện Enter cho thanh tìm kiếm
    let searchInputs = document.querySelectorAll('.custom-search');
    for (let i = 0; i < searchInputs.length; i++) {
        searchInputs[i].addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                let keyword = this.value.trim();
                if (keyword !== '') {
                    window.location.href = 'productCatalog.html?search=' + encodeURIComponent(keyword);
                }
            }
        });
    }
});