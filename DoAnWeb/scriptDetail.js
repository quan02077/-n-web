// --- HÀM RANDOM 3 SẢN PHẨM GỢI Ý ---
function renderRandomProducts(currentProductId) {
    let container = document.getElementById('relatedProducts');
    if (!container || typeof productsDatabase === 'undefined') return;

    let availableProducts = [];
    for (let i = 0; i < productsDatabase.length; i++) {
        if (productsDatabase[i].id !== currentProductId) {
            availableProducts.push(productsDatabase[i]);
        }
    }

    availableProducts.sort(function() { return 0.5 - Math.random() });
    let randomProducts = availableProducts.slice(0, 3);

    let htmlContent = "";
    for (let i = 0; i < randomProducts.length; i++) {
        let p = randomProducts[i];
        let priceFormat = p.price.toLocaleString('vi-VN') + '₫';
        
        htmlContent += '<div class="col-10 col-md-4 flex-shrink-0">';
        htmlContent += '  <a href="productDetail.html?id=' + p.id + '" class="text-decoration-none text-dark related-card">';
        htmlContent += '      <div class="border-0">';
        htmlContent += '          <div class="mb-3 bg-light rounded d-flex align-items-center justify-content-center" style="aspect-ratio: 1/1; overflow: hidden;">';
        htmlContent += '              <img src="' + p.img + '" class="img-fluid w-100 h-100 object-fit-contain p-3" style="transition: transform 0.3s ease;">';
        htmlContent += '          </div>';
        htmlContent += '          <h6 class="fw-bold mb-1">' + p.name + '</h6>';
        htmlContent += '          <p class="text-secondary mb-1 small">' + p.category + ' - ' + p.gender + '</p>';
        htmlContent += '          <p class="fw-bold mt-2">' + priceFormat + '</p>';
        htmlContent += '      </div>';
        htmlContent += '  </a>';
        htmlContent += '</div>';
    }
    container.innerHTML = htmlContent;
}

// --- HÀM THÊM VÀO GIỎ HÀNG ---
function addToCart() {
    let selectedSizeBtn = document.querySelector('.size-btn.active-size');
    
    if (!selectedSizeBtn) {
        alert("Vui lòng chọn Size trước khi thêm vào giỏ hàng!");
        return;
    }
    
    let size = selectedSizeBtn.innerText;
    
    let urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));
    
    if (typeof addToCartItem === 'function') {
        addToCartItem(productId, size);
        openCartPanel();
    } else {
        alert("Lỗi: Không tìm thấy file cart.js.");
    }
}

// --- KHỞI CHẠY KHI MỞ TRANG ---
window.onload = function() {
    
    // 1. TẢI DỮ LIỆU SẢN PHẨM LÊN MÀN HÌNH
    let urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));

    if (typeof productsDatabase !== 'undefined' && productId) {
        let product = null;
        for (let i = 0; i < productsDatabase.length; i++) {
            if (productsDatabase[i].id === productId) {
                product = productsDatabase[i];
                break;
            }
        }
        
        if (product) {
            document.getElementById('productName').innerText = product.name;
            document.getElementById('productCategory').innerText = product.category + " - " + product.gender;
            document.getElementById('productPrice').innerText = product.price.toLocaleString('vi-VN') + " đ";
            document.getElementById('mainProductImg').src = product.img;
            document.title = product.name + " - Basau Sneakers";

            // Gọi hàm random sản phẩm bên dưới
            renderRandomProducts(productId);
            
            // Đã xóa hoàn toàn phần Render Thumbnail và Color dư thừa ở đây
        } else {
            document.getElementById('productName').innerText = "Sản phẩm không tồn tại";
        }
    }

    // 2. LOGIC CHỌN SIZE (Đổi màu nút)
    let sizeButtons = document.querySelectorAll('.size-btn');
    for (let i = 0; i < sizeButtons.length; i++) {
        sizeButtons[i].addEventListener('click', function() {
            for (let j = 0; j < sizeButtons.length; j++) {
                sizeButtons[j].classList.remove('active-size');
            }
            this.classList.add('active-size');
        });
    }

    // 3. LOGIC HIỂN THỊ TÊN ĐĂNG NHẬP
    let currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
        let currentUser = JSON.parse(currentUserData);
        let userAccountText = document.getElementById('userAccountText');
        let userIconImg = document.getElementById('userIconImg');
        let userAccountLink = document.getElementById('userAccountLink');

        if (userAccountText && userIconImg && userAccountLink) {
            userAccountText.innerText = currentUser.username;
            userIconImg.src = "hinhAnh/userHomeIcon.png"; 
            userAccountLink.addEventListener('click', function(event) {
                event.preventDefault();
                if (confirm("Bạn có muốn đăng xuất không?")) {
                    localStorage.removeItem('currentUser'); 
                    window.location.reload(); 
                }
            });
        }
    }

    // 4. MENU MOBILE
    let menuToggle = document.querySelector('.menu-toggle');
    let menu = document.querySelector('.menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
};