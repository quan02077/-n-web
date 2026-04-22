// 1. HÀM TỰ ĐỘNG TẠO GIAO DIỆN GIỎ HÀNG (Không cần viết bên HTML nữa)
function injectCartHTML() {
    if (document.getElementById('cartPanel')) return; // Nếu có rồi thì bỏ qua

    let overlay = document.createElement('div');
    overlay.id = 'cartOverlay';
    overlay.onclick = closeCartPanel;

    let panel = document.createElement('div');
    panel.id = 'cartPanel';
    panel.innerHTML = `
        <div style="background:#111; color:#fff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
            <div>
                <h5 style="margin:0; font-family:'Oswald',sans-serif; font-size:20px; letter-spacing:2px;">🛒 GIỎ HÀNG</h5>
                <p id="cartHeaderCount" style="margin:3px 0 0; font-size:12px; color:#aaa;">0 sản phẩm</p>
            </div>
            <button onclick="closeCartPanel()" style="background:rgba(255,255,255,.12);border:none;color:#fff; width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer; display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
        <div id="cartItemsContainer" style="flex:1; overflow-y:auto; padding:0 20px;"></div>
        <div id="cartFooter" style="padding:20px; border-top:2px solid #f0f0f0; flex-shrink:0;"></div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
}

// 2. CÁC HÀM XỬ LÝ DỮ LIỆU
function getCart() {
    let cartData = localStorage.getItem('basau_cart');
    return cartData ? JSON.parse(cartData) : [];
}

function saveCart(cart) {
    localStorage.setItem('basau_cart', JSON.stringify(cart));
    updateCartCount();
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

document.addEventListener('DOMContentLoaded', function () {
    injectCartHTML();
    updateCartCount(); 

    // Gắn sự kiện mở giỏ hàng cho các nút
    let links = document.querySelectorAll('.tienich a');
    links.forEach(link => {
        if (link.innerHTML.includes('cartIcon')) {
            link.onclick = function (e) {
                e.preventDefault();
                openCartPanel();
            };
        }
    });
});

function addToCartItem(productId, size) {
    // 1. Lấy giỏ hàng cũ ra (nếu có)
    let cartData = localStorage.getItem('basau_cart');
    let cart = cartData ? JSON.parse(cartData) : [];

    // 2. Tìm đôi giày trong kho data.js
    let product = null;
    for (let i = 0; i < productsDatabase.length; i++) {
        if (productsDatabase[i].id === productId) {
            product = productsDatabase[i];
            break;
        }
    }
    if (!product) return;

    // 3. Kiểm tra xem giày + size này đã có trong giỏ chưa
    let existingItem = null;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].id === productId && cart[i].size === size) {
            existingItem = cart[i];
            break;
        }
    }

    // 4. Nếu có rồi thì tăng số lượng, chưa có thì thêm mới
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            img: product.img,
            size: size,
            quantity: 1
        });
    }

    // 5. Lưu ngược lại vào bộ nhớ và hiện thông báo
    localStorage.setItem('basau_cart', JSON.stringify(cart));
    
    // Gọi hàm hiện thông báo (nếu có)
    if (typeof showCartToast === 'function') {
        showCartToast(product.name, size);
    }
}

function showCartToast(name, size) {
    let toast = document.createElement('div');
    toast.style.cssText = 'position:fixed;bottom:28px;right:28px;background:#111;color:#fff;padding:16px 24px;border-radius:14px;font-family:"Josefin Sans",sans-serif;font-size:14px;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,.35);opacity:0;transform:translateY(12px);transition:all .3s ease;max-width:320px;';
    
    // Đã sửa chữ item.name thành chữ name ở dòng dưới
    toast.innerHTML = '<span style="color:#4ade80;font-size:18px;margin-right:8px;">✓</span>Đã thêm <strong>' + name + '</strong><br><span style="color:#aaa;font-size:12px;">Size ' + size + '</span>';

    document.body.appendChild(toast);
    setTimeout(function () { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 30);
    setTimeout(function () {
        toast.style.opacity = '0'; toast.style.transform = 'translateY(12px)';
        setTimeout(function () { toast.remove(); }, 350);
    }, 2400);
}

// 4. MỞ, ĐÓNG & VẼ GIAO DIỆN BÊN TRONG GIỎ HÀNG
function openCartPanel() {
    renderCartPanel();
    let panel = document.getElementById('cartPanel');
    let overlay = document.getElementById('cartOverlay');
    if (panel && overlay) {
        setTimeout(function () {
            panel.classList.add('open');
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
        }, 10);
    }
}

function closeCartPanel() {
    let panel = document.getElementById('cartPanel');
    let overlay = document.getElementById('cartOverlay');
    if (panel && overlay) {
        panel.classList.remove('open');
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }
}

function renderCartPanel() {
    let cart = getCart();
    let container = document.getElementById('cartItemsContainer');
    let footer = document.getElementById('cartFooter');
    let countEl = document.getElementById('cartHeaderCount');
    if (!container || !footer) return;

    let totalQty = 0, totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        totalQty += cart[i].quantity;
        totalPrice += (cart[i].price * cart[i].quantity);
    }
    if (countEl) countEl.textContent = totalQty + ' sản phẩm';

    if (cart.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:70px 20px; color:#bbb;"><div style="font-size:64px; margin-bottom:18px; filter:grayscale(1);">🛒</div><h5 style="color:#888; margin-bottom:8px;">Giỏ hàng trống</h5><p style="font-size:14px;">Hãy thêm sản phẩm vào giỏ hàng nhé!</p><button onclick="closeCartPanel()" style="background:#111;color:#fff;border:none;padding:12px 28px;border-radius:50px;font-weight:700;cursor:pointer;margin-top:12px;">TIẾP TỤC MUA SẮM</button></div>';
        footer.innerHTML = '';
        return;
    }

    let htmlContent = "";
    for (let i = 0; i < cart.length; i++) {
        let item = cart[i];
        htmlContent += '<div class="cart-item">';
        htmlContent += '  <img src="' + item.img + '" class="cart-item-img" onerror="this.src=\'hinhAnh/logo.jpg\'">';
        htmlContent += '  <div style="flex:1; min-width:0;">';
        htmlContent += '    <div style="font-weight:700; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">' + item.name + '</div>';
        htmlContent += '    <div style="color:#888; font-size:12px; margin:4px 0;">Size: <strong>' + item.size + '</strong></div>';
        htmlContent += '    <div style="color:#dc3545; font-weight:700; font-size:15px;">' + (item.price * item.quantity).toLocaleString('vi-VN') + '₫</div>';
        htmlContent += '    <div style="display:flex; align-items:center; gap:10px; margin-top:10px;">';
        htmlContent += '      <button class="cart-qty-btn" onclick="changeCartQty(' + i + ', -1)">−</button>';
        htmlContent += '      <span style="font-weight:700; min-width:24px; text-align:center;">' + item.quantity + '</span>';
        htmlContent += '      <button class="cart-qty-btn" onclick="changeCartQty(' + i + ', 1)">+</button>';
        htmlContent += '      <button class="cart-remove" onclick="removeCartItem(' + i + ')" title="Xóa">✕</button>';
        htmlContent += '    </div></div></div>';
    }
    container.innerHTML = htmlContent;
    footer.innerHTML = '<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:16px;"><span style="font-size:14px; color:#888;">Tổng cộng</span><span style="font-size:22px; font-weight:800; color:#dc3545;">' + totalPrice.toLocaleString('vi-VN') + '₫</span></div><button class="cart-checkout-btn" onclick="window.location.href=\'checkout.html\'">TIẾN HÀNH THANH TOÁN</button><button class="cart-clear-btn" onclick="clearCart()">Xóa tất cả</button>';
}

// 5. CÁC NÚT ĐIỀU KHIỂN TRONG GIỎ
function changeCartQty(index, amount) {
    let cart = getCart();
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart); renderCartPanel();
}
function removeCartItem(index) {
    let cart = getCart(); cart.splice(index, 1);
    saveCart(cart); renderCartPanel();
}
function clearCart() {
    if (confirm('Bạn có muốn xóa toàn bộ giỏ hàng không?')) { saveCart([]); renderCartPanel(); }
}
// 6. KHỞI CHẠY KHI MỞ TRANG
document.addEventListener('DOMContentLoaded', function () {
    injectCartHTML();
    updateCartCount();

    checkAdminAccess();

    let links = document.querySelectorAll('.tienich a');
    for (let i = 0; i < links.length; i++) {
        let img = links[i].querySelector('img');
        if (img && img.getAttribute('src').includes('cartIcon')) {
            links[i].href = '#';
            links[i].onclick = function (e) {
                e.preventDefault();
                openCartPanel();
            };
        }
    }
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