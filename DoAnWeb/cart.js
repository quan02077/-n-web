// ============================================================
//  CART.JS – Giỏ hàng Basau Sneakers
// ============================================================

// ──────────────────────────────────────────────────────────
//  DATA LAYER
// ──────────────────────────────────────────────────────────

function getCart() {
    return JSON.parse(localStorage.getItem('basau_cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('basau_cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    var cart  = getCart();
    var total = cart.reduce(function(s, item) { return s + item.quantity; }, 0);

    document.querySelectorAll('.tienich a').forEach(function(link) {
        var img = link.querySelector('img');
        if (!img) return;
        var src = img.getAttribute('src') || '';
        if (src.indexOf('cartIcon') !== -1) {
            // Chỉ cập nhật phần text, giữ lại img tag
            var textNode = null;
            link.childNodes.forEach(function(node) {
                if (node.nodeType === 3) textNode = node; // text node
            });
            if (textNode) {
                textNode.textContent = 'Giỏ hàng (' + total + ')';
            } else {
                link.lastChild.textContent = 'Giỏ hàng (' + total + ')';
            }
        }
    });
}

// ──────────────────────────────────────────────────────────
//  THÊM VÀO GIỎ HÀNG (gọi từ productDetail)
// ──────────────────────────────────────────────────────────

function addToCartItem(productId, size) {
    // getAllProducts() được định nghĩa trong admin.js
    var products = (typeof getAllProducts === 'function') ? getAllProducts() : (typeof productsDatabase !== 'undefined' ? productsDatabase : []);
    var product  = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === productId) { product = products[i]; break; }
    }

    if (!product) { alert('Không tìm thấy sản phẩm!'); return; }

    var cart     = getCart();
    var existing = null;
    for (var j = 0; j < cart.length; j++) {
        if (cart[j].id === productId && cart[j].size === size) { existing = cart[j]; break; }
    }

    if (existing) {
        existing.quantity++;
    } else {
        cart.push({
            id:       productId,
            name:     product.name,
            brand:    product.brand,
            price:    product.price,
            img:      product.img,
            size:     size,
            quantity: 1
        });
    }

    saveCart(cart);
    showCartToast(product.name, size);
}

function showCartToast(name, size) {
    var t = document.createElement('div');
    t.style.cssText = 'position:fixed;bottom:28px;right:28px;background:#111;color:#fff;' +
        'padding:16px 24px;border-radius:14px;font-family:"Josefin Sans",sans-serif;' +
        'font-size:14px;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,.35);' +
        'opacity:0;transform:translateY(12px);transition:all .3s ease;max-width:320px;';
    t.innerHTML = '<span style="color:#4ade80;font-size:18px;margin-right:8px;">✓</span>' +
        'Đã thêm <strong>' + name + '</strong><br><span style="color:#aaa;font-size:12px;">Size ' + size + '</span>';
    document.body.appendChild(t);
    setTimeout(function() { t.style.opacity = '1'; t.style.transform = 'translateY(0)'; }, 30);
    setTimeout(function() {
        t.style.opacity = '0'; t.style.transform = 'translateY(12px)';
        setTimeout(function() { t.remove(); }, 350);
    }, 2400);
}

// ──────────────────────────────────────────────────────────
//  CART PANEL UI
// ──────────────────────────────────────────────────────────

function injectCartPanel() {
    if (document.getElementById('cartPanel')) return;

    var html = `
<style>
  #cartPanel *              { box-sizing:border-box; }
  #cartPanel                { position:fixed; top:0; right:0; width:420px; max-width:100vw; height:100%;
                              background:#fff; z-index:10001; display:flex; flex-direction:column;
                              box-shadow:-12px 0 50px rgba(0,0,0,.18); transform:translateX(100%);
                              transition:transform .35s cubic-bezier(.4,0,.2,1);
                              font-family:"Josefin Sans",sans-serif; }
  #cartPanel.open           { transform:translateX(0); }
  #cartOverlay              { position:fixed; top:0; left:0; width:100%; height:100%;
                              background:rgba(0,0,0,.5); z-index:10000; opacity:0;
                              transition:opacity .35s ease; pointer-events:none; }
  #cartOverlay.open         { opacity:1; pointer-events:all; }
  .cart-item                { display:flex; gap:14px; padding:16px 0; border-bottom:1px solid #f0f0f0; }
  .cart-item:last-child     { border-bottom:none; }
  .cart-item-img            { width:84px; height:84px; object-fit:contain; background:#f7f7f7;
                              border-radius:10px; flex-shrink:0; }
  .cart-qty-btn             { width:30px; height:30px; border:1.5px solid #e0e0e0; background:#fff;
                              border-radius:50%; cursor:pointer; font-size:16px; display:flex;
                              align-items:center; justify-content:center; transition:.2s; font-weight:700; }
  .cart-qty-btn:hover       { border-color:#111; background:#111; color:#fff; }
  .cart-remove              { background:none; border:none; color:#ccc; cursor:pointer;
                              font-size:18px; line-height:1; transition:.2s; padding:0; }
  .cart-remove:hover        { color:#dc3545; }
  .cart-checkout-btn        { background:#111; color:#fff; border:none; padding:15px;
                              border-radius:50px; font-size:15px; font-weight:700; cursor:pointer;
                              width:100%; letter-spacing:.5px; transition:.2s; }
  .cart-checkout-btn:hover  { background:#333; }
  .cart-clear-btn           { background:none; border:1.5px solid #eee; padding:11px;
                              border-radius:50px; font-size:13px; cursor:pointer; width:100%;
                              margin-top:10px; color:#888; transition:.2s; }
  .cart-clear-btn:hover     { border-color:#dc3545; color:#dc3545; }
  #cartItemsContainer::-webkit-scrollbar       { width:4px; }
  #cartItemsContainer::-webkit-scrollbar-thumb { background:#ddd; border-radius:4px; }
</style>

<div id="cartOverlay" onclick="closeCartPanel()"></div>

<div id="cartPanel">
  <!-- Header -->
  <div style="background:#111; color:#fff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
    <div>
      <h5 style="margin:0; font-family:'Oswald',sans-serif; font-size:20px; letter-spacing:2px;">🛒 GIỎ HÀNG</h5>
      <p id="cartHeaderCount" style="margin:3px 0 0; font-size:12px; color:#aaa;">0 sản phẩm</p>
    </div>
    <button onclick="closeCartPanel()" style="background:rgba(255,255,255,.12);border:none;color:#fff;
            width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;
            display:flex;align-items:center;justify-content:center;">✕</button>
  </div>

  <!-- Items -->
  <div id="cartItemsContainer" style="flex:1; overflow-y:auto; padding:0 20px;"></div>

  <!-- Footer -->
  <div id="cartFooter" style="padding:20px; border-top:2px solid #f0f0f0; flex-shrink:0;"></div>
</div>`;

    document.body.insertAdjacentHTML('beforeend', html);
}

function openCartPanel() {
    injectCartPanel();
    renderCartPanel();

    var panel   = document.getElementById('cartPanel');
    var overlay = document.getElementById('cartOverlay');

    // Cần 1 frame để transition hoạt động
    requestAnimationFrame(function() {
        panel.classList.add('open');
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
}

function closeCartPanel() {
    var panel   = document.getElementById('cartPanel');
    var overlay = document.getElementById('cartOverlay');
    if (!panel) return;

    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
}

function renderCartPanel() {
    var cart      = getCart();
    var container = document.getElementById('cartItemsContainer');
    var footer    = document.getElementById('cartFooter');
    var countEl   = document.getElementById('cartHeaderCount');

    var totalQty = cart.reduce(function(s, i) { return s + i.quantity; }, 0);
    if (countEl) countEl.textContent = totalQty + ' sản phẩm';

    if (cart.length === 0) {
        container.innerHTML = [
            '<div style="text-align:center; padding:70px 20px; color:#bbb;">',
            '<div style="font-size:64px; margin-bottom:18px; filter:grayscale(1);">🛒</div>',
            '<h5 style="color:#888; margin-bottom:8px;">Giỏ hàng trống</h5>',
            '<p style="font-size:14px;">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>',
            '<button onclick="closeCartPanel()" style="background:#111;color:#fff;border:none;',
            'padding:12px 28px;border-radius:50px;font-weight:700;cursor:pointer;margin-top:12px;">',
            'TIẾP TỤC MUA SẮM</button></div>'
        ].join('');
        footer.innerHTML = '';
        return;
    }

    var total = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);

    container.innerHTML = cart.map(function(item, idx) {
        return [
            '<div class="cart-item">',
            '<img src="', item.img, '" class="cart-item-img" onerror="this.src=\'hinhAnh/logo.jpg\'">',
            '<div style="flex:1; min-width:0;">',
            '<div style="font-weight:700; font-size:14px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">', escapeHtmlCart(item.name), '</div>',
            '<div style="color:#888; font-size:12px; margin:4px 0;">Size: <strong>', item.size, '</strong></div>',
            '<div style="color:#dc3545; font-weight:700; font-size:15px;">', item.price.toLocaleString('vi-VN'), '₫</div>',
            '<div style="display:flex; align-items:center; gap:10px; margin-top:10px;">',
            '<button class="cart-qty-btn" onclick="changeCartQty(', idx, ', -1)">−</button>',
            '<span style="font-weight:700; min-width:24px; text-align:center;">', item.quantity, '</span>',
            '<button class="cart-qty-btn" onclick="changeCartQty(', idx, ', 1)">+</button>',
            '<button class="cart-remove" onclick="removeCartItem(', idx, ')" title="Xóa">✕</button>',
            '</div>',
            '</div></div>'
        ].join('');
    }).join('');

    footer.innerHTML = [
        '<div style="display:flex; justify-content:space-between; align-items:baseline; margin-bottom:16px;">',
        '<span style="font-size:14px; color:#888;">Tổng cộng</span>',
        '<span style="font-size:22px; font-weight:800; color:#dc3545;">', total.toLocaleString('vi-VN'), '₫</span>',
        '</div>',
        '<button class="cart-checkout-btn" onclick="checkout()">THANH TOÁN NGAY →</button>',
        '<button class="cart-clear-btn" onclick="clearCart()">Xóa tất cả</button>'
    ].join('');
}

function changeCartQty(index, delta) {
    var cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveCart(cart);
    renderCartPanel();
}

function removeCartItem(index) {
    var cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    renderCartPanel();
}

function clearCart() {
    if (confirm('Bạn có muốn xóa toàn bộ giỏ hàng không?')) {
        saveCart([]);
        renderCartPanel();
    }
}

function checkout() {
    var cart = getCart();
    if (!cart.length) return;

    var total = cart.reduce(function(s, i) { return s + i.price * i.quantity; }, 0);
    var lines = ['📦 ĐƠN HÀNG CỦA BẠN:\n'];
    cart.forEach(function(item) {
        lines.push('• ' + item.name + ' – Size ' + item.size + ' × ' + item.quantity +
            ': ' + (item.price * item.quantity).toLocaleString('vi-VN') + '₫');
    });
    lines.push('\n💰 TỔNG CỘNG: ' + total.toLocaleString('vi-VN') + '₫');
    lines.push('\nCảm ơn bạn đã mua hàng tại BASAU! 🎉');

    alert(lines.join('\n'));
    saveCart([]);
    closeCartPanel();
}

function escapeHtmlCart(str) {
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ──────────────────────────────────────────────────────────
//  SETUP LINKS & INIT
// ──────────────────────────────────────────────────────────

function setupCartLink() {
    document.querySelectorAll('.tienich a').forEach(function(link) {
        var img = link.querySelector('img');
        if (!img) return;
        var src = img.getAttribute('src') || '';
        if (src.indexOf('cartIcon') !== -1) {
            link.href = '#';
            link.onclick = function(e) { e.preventDefault(); openCartPanel(); };
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    setupCartLink();
});