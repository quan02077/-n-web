// --- LOGIC CHO TRANG CHI TIẾT SẢN PHẨM ---

function changeImage(element) {
    let mainImg = document.getElementById('mainProductImg');
    mainImg.src = element.src;
    
    let thumbs = document.querySelectorAll('.thumbnail-list img');
    for(let i = 0; i < thumbs.length; i++){
        thumbs[i].classList.remove('active-thumb');
    }
    element.classList.add('active-thumb');
}

// Đã xóa hàm selectColor() dư thừa

// Hàm Thêm vào giỏ hàng kết nối trực tiếp với cart.js
function addToCart() {
    let selectedSizeBtn = document.querySelector('.size-btn.active-size');
    
    if (!selectedSizeBtn) {
        alert("Vui lòng chọn Size trước khi thêm vào giỏ hàng!");
        return;
    }
    
    let size = selectedSizeBtn.innerText;
    
    // Lấy ID sản phẩm từ URL (vd: ?id=2)
    let urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));
    
    // Gọi hàm từ file cart.js để lưu dữ liệu
    if (typeof addToCartItem === 'function') {
        addToCartItem(productId, size);
        openCartPanel(); // Thêm xong thì trượt bảng Giỏ hàng ra
    } else {
        alert("Lỗi: Không tìm thấy file cart.js. Vui lòng kiểm tra lại thẻ <script>.");
    }
}

window.onload = function() {
    // 1. TẢI DỮ LIỆU SẢN PHẨM DỰA TRÊN ID
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
            document.getElementById('productCategory').innerText = product.category;
            // Đã đổi thành giá dạng số, nên phải format lại thành tiền Việt
            document.getElementById('productPrice').innerText = product.price.toLocaleString('vi-VN') + " đ";
            document.getElementById('mainProductImg').src = product.img;
            document.title = product.name + " - Basau Sneakers";

            // Cập nhật Ảnh nhỏ (Thumbnails)
            let thumbContainer = document.getElementById('thumbnailContainer');
            thumbContainer.innerHTML = '';
            // Sẽ tự động lấy duy nhất 1 ảnh gốc trong mảng thumbnails để thu nhỏ lại
            for (let i = 0; i < product.thumbnails.length; i++) {
                let thumb = product.thumbnails[i];
                let activeClass = (i === 0) ? 'active-thumb' : '';
                thumbContainer.innerHTML += '<img src="' + thumb + '" class="img-thumbnail ' + activeClass + '" onclick="changeImage(this)">';
            }

            // Đã xóa phần render màu sắc rườm rà

        } else {
            document.getElementById('productName').innerText = "Sản phẩm không tồn tại";
        }
    }

    // 2. CHỌN SIZE (Tô viền đen khi bấm vào)
    let sizeButtons = document.querySelectorAll('.size-btn');
    for (let i = 0; i < sizeButtons.length; i++) {
        sizeButtons[i].addEventListener('click', function() {
            for (let j = 0; j < sizeButtons.length; j++) {
                sizeButtons[j].classList.remove('active-size');
            }
            this.classList.add('active-size');
        });
    }

    // 3. LOGIC ĐĂNG NHẬP TRÊN HEADER
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

    // 4. MENU 3 GẠCH BÊN TRÁI MÀN HÌNH (Mobile)
    let menuToggle = document.querySelector('.menu-toggle');
    let menu = document.querySelector('.menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
};