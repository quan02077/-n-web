document.addEventListener('DOMContentLoaded', function() {
    // 1. LẤY ID TỪ URL
    let urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));

    if (typeof productsDatabase !== 'undefined' && productId) {
        // Tìm sản phẩm bằng vòng lặp FOR
        let product = null;
        for (let i = 0; i < productsDatabase.length; i++) {
            if (productsDatabase[i].id === productId) {
                product = productsDatabase[i];
                break;
            }
        }
        
        if (product !== null) {
            document.getElementById('productName').innerText = product.name;
            document.getElementById('productCategory').innerText = product.category;
            document.getElementById('productPrice').innerText = product.price.toLocaleString('vi-VN') + " đ";
            // Dùng chung key 'img' từ file data.js
            document.getElementById('mainProductImg').src = product.img; 
            document.title = product.name + " - Basau Sneakers";

            // Vẽ hình nhỏ (Thumbnails)
            let thumbContainer = document.getElementById('thumbnailContainer');
            thumbContainer.innerHTML = '';
            for (let i = 0; i < product.thumbnails.length; i++) {
                let thumb = product.thumbnails[i];
                let activeClass = "";
                if (i === 0) activeClass = "active-thumb";
                thumbContainer.innerHTML += "<img src='" + thumb + "' class='img-thumbnail " + activeClass + "' onclick='changeImage(this)'>";
            }

            // Vẽ Màu sắc (Colors)
            let colorContainer = document.getElementById('colorContainer');
            colorContainer.innerHTML = ''; 
            for (let i = 0; i < product.colors.length; i++) {
                let color = product.colors[i];
                let activeClass = "";
                if (i === 0) activeClass = "active-color";
                colorContainer.innerHTML += "<img src='" + color + "' class='color-thumb border " + activeClass + "' onclick='selectColor(this)'>";
            }
        } else {
            document.getElementById('productName').innerText = "Sản phẩm không tồn tại";
        }
    }

    // 2. CHỌN SIZE
    let sizeButtons = document.querySelectorAll('.size-btn');
    for (let i = 0; i < sizeButtons.length; i++) {
        sizeButtons[i].addEventListener('click', function() {
            for (let j = 0; j < sizeButtons.length; j++) {
                sizeButtons[j].classList.remove('active-size');
            }
            this.classList.add('active-size');
        });
    }

    // 3. MENU 3 GẠCH (Mobile)
    let menuToggle = document.querySelector('.menu-toggle');
    let menu = document.querySelector('.menu');
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function() {
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            } else {
                menu.classList.add('active');
            }
        });
    }

    // 4. HIỂN THỊ ĐĂNG NHẬP
    let currentUserData = localStorage.getItem('currentUser');
    if (currentUserData) {
        let currentUser = JSON.parse(currentUserData);
        let userAccountText = document.getElementById('userAccountText');
        if (userAccountText) {
            userAccountText.innerText = currentUser.username;
        }
    }
});
function changeImage(element) {
    let mainImg = document.getElementById('mainProductImg');
    mainImg.src = element.src;
    
    let thumbs = document.querySelectorAll('.thumbnail-list img');
    for (let i = 0; i < thumbs.length; i++) {
        thumbs[i].classList.remove('active-thumb');
    }
    element.classList.add('active-thumb');
}

function selectColor(element) {
    let colors = document.querySelectorAll('.color-thumb');
    for (let i = 0; i < colors.length; i++) {
        colors[i].classList.remove('active-color');
    }
    element.classList.add('active-color');
}

function addToCart() {
    let selectedSize = document.querySelector('.size-btn.active-size');
    let productName = document.getElementById('productName').innerText;

    if (!selectedSize) {
        alert("Vui lòng chọn Size trước khi thêm vào giỏ hàng!");
        return;
    }
    alert("Thành công! Đã thêm " + productName + " - Size " + selectedSize.innerText + " vào giỏ hàng.");
}
