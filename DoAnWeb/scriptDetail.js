// --- LOGIC CHO TRANG CHI TIẾT SẢN PHẨM ---

function changeImage(element) {
    const mainImg = document.getElementById('mainProductImg');
    mainImg.src = element.src;
    document.querySelectorAll('.thumbnail-list img').forEach(img => img.classList.remove('active-thumb'));
    element.classList.add('active-thumb');
}

function selectColor(element) {
    document.querySelectorAll('.color-thumb').forEach(img => img.classList.remove('active-color'));
    element.classList.add('active-color');
}

function addToBag() {
    const selectedSize = document.querySelector('.size-btn.active-size');
    const productName = document.getElementById('productName').innerText;

    if (!selectedSize) {
        alert("Vui lòng chọn Size trước khi thêm vào giỏ hàng!");
        return;
    }
    alert(`Thành công! Đã thêm ${productName} - Size ${selectedSize.innerText} vào giỏ hàng.`);
}

document.addEventListener('DOMContentLoaded', function() {
    // 1. TẢI DỮ LIỆU SẢN PHẨM DỰA TRÊN ID
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (typeof productsDatabase !== 'undefined' && productId) {
        const product = productsDatabase.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('productName').innerText = product.name;
            document.getElementById('productCategory').innerText = product.category;
            document.getElementById('productPrice').innerText = product.price;
            document.getElementById('mainProductImg').src = product.mainImage;
            document.title = `${product.name} - Basau Sneakers`;

            // Cập nhật Thumbnails
            const thumbContainer = document.getElementById('thumbnailContainer');
            thumbContainer.innerHTML = '';
            product.thumbnails.forEach((thumb, index) => {
                let activeClass = index === 0 ? 'active-thumb' : '';
                thumbContainer.innerHTML += `<img src="${thumb}" class="img-thumbnail ${activeClass}" onclick="changeImage(this)">`;
            });

            // Cập nhật Colors
            const colorContainer = document.getElementById('colorContainer');
            colorContainer.innerHTML = ''; 
            product.colors.forEach((color, index) => {
                let activeClass = index === 0 ? 'active-color' : '';
                colorContainer.innerHTML += `<img src="${color}" class="color-thumb border ${activeClass}" onclick="selectColor(this)">`;
            });
        } else {
            document.getElementById('productName').innerText = "Sản phẩm không tồn tại";
        }
    }

    // 2. CHỌN SIZE
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            sizeButtons.forEach(b => b.classList.remove('active-size'));
            this.classList.add('active-size');
        });
    });

    // 3. LOGIC ĐĂNG NHẬP TRÊN HEADER
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userAccountText = document.getElementById('userAccountText');
    const userIconImg = document.getElementById('userIconImg');
    const userAccountLink = document.getElementById('userAccountLink');

    if (currentUser && userAccountText && userIconImg && userAccountLink) {
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

    // 4. MENU 3 GẠCH (Mobile)
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', () => menu.classList.toggle('active'));
    }
});