// scriptDetail.js – Chi tiết sản phẩm (đã tích hợp giỏ hàng)

var currentProductId = null; // Lưu ID sản phẩm hiện tại để dùng trong addToCart()

document.addEventListener('DOMContentLoaded', function() {

    // 1. LẤY ID TỪ URL
    var urlParams  = new URLSearchParams(window.location.search);
    currentProductId = parseInt(urlParams.get('id'));

    // Dùng getAllProducts() từ admin.js (nếu có) để nhận sản phẩm đã được chỉnh sửa/thêm
    var products = (typeof getAllProducts === 'function') ? getAllProducts()
                 : (typeof productsDatabase !== 'undefined') ? productsDatabase : [];

    if (products.length && currentProductId) {
        // Tìm sản phẩm
        var product = null;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === currentProductId) { product = products[i]; break; }
        }

        if (product !== null) {
            document.getElementById('productName').innerText     = product.name;
            document.getElementById('productCategory').innerText = product.category;
            document.getElementById('productPrice').innerText    = product.price.toLocaleString('vi-VN') + ' đ';
            document.getElementById('mainProductImg').src        = product.img;
            document.title = product.name + ' – Basau Sneakers';

            // Thumbnails
            var thumbContainer = document.getElementById('thumbnailContainer');
            thumbContainer.innerHTML = '';
            for (var t = 0; t < product.thumbnails.length; t++) {
                var activeClass = (t === 0) ? 'active-thumb' : '';
                thumbContainer.innerHTML += '<img src="' + product.thumbnails[t] +
                    '" class="img-thumbnail ' + activeClass + '" onclick="changeImage(this)">';
            }

            // Colors
            var colorContainer = document.getElementById('colorContainer');
            colorContainer.innerHTML = '';
            for (var c = 0; c < product.colors.length; c++) {
                var aClass = (c === 0) ? 'active-color' : '';
                colorContainer.innerHTML += '<img src="' + product.colors[c] +
                    '" class="color-thumb border ' + aClass + '" onclick="selectColor(this)">';
            }
        } else {
            document.getElementById('productName').innerText = 'Sản phẩm không tồn tại';
        }
    }

    // 2. CHỌN SIZE
    var sizeButtons = document.querySelectorAll('.size-btn');
    for (var s = 0; s < sizeButtons.length; s++) {
        sizeButtons[s].addEventListener('click', function() {
            for (var k = 0; k < sizeButtons.length; k++) {
                sizeButtons[k].classList.remove('active-size');
            }
            this.classList.add('active-size');
        });
    }

    // 3. MENU 3 GẠCH (Mobile)
    var menuToggle = document.querySelector('.menu-toggle');
    var menu       = document.querySelector('.menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }

    // 4. HIỂN THỊ TÊN TÀI KHOẢN
    var currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
        var currentUser     = JSON.parse(currentUserData);
        var userAccountText = document.getElementById('userAccountText');
        if (userAccountText) userAccountText.innerText = currentUser.username;
    }
});

// ──────────────────────────────────────────────────────────
//  THÊM VÀO GIỎ HÀNG (gọi từ nút trong HTML)
// ──────────────────────────────────────────────────────────
function addToCart() {
    var selectedSize = document.querySelector('.size-btn.active-size');

    if (!selectedSize) {
        alert('Vui lòng chọn Size trước khi thêm vào giỏ hàng!');
        return;
    }

    // Dùng hàm từ cart.js
    if (typeof addToCartItem === 'function' && currentProductId) {
        addToCartItem(currentProductId, selectedSize.innerText);
    } else {
        // Fallback nếu cart.js chưa load
        var productName = document.getElementById('productName').innerText;
        alert('Đã thêm ' + productName + ' – Size ' + selectedSize.innerText + ' vào giỏ hàng!');
    }
}

// ──────────────────────────────────────────────────────────
//  ĐỔI ẢNH CHÍNH / CHỌN MÀU
// ──────────────────────────────────────────────────────────
function changeImage(element) {
    document.getElementById('mainProductImg').src = element.src;
    document.querySelectorAll('.thumbnail-list img').forEach(function(img) {
        img.classList.remove('active-thumb');
    });
    element.classList.add('active-thumb');
}

function selectColor(element) {
    document.querySelectorAll('.color-thumb').forEach(function(img) {
        img.classList.remove('active-color');
    });
    element.classList.add('active-color');
}