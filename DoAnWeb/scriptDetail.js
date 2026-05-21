//addtocart: thêm sản phẩm vào giỏ hàng
function addToCart() {
    let name = document.getElementById('productName').innerText;
    let priceText = document.getElementById('productPrice').innerText;
    let price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
    let img = document.getElementById('mainProductImg').src;
    let activeSizeBtn = document.querySelector('.size-btn.active') || document.querySelector('.size-btn.btn-dark');
    let firstSizeBtn = document.querySelector('.size-btn');
    let size = activeSizeBtn ? activeSizeBtn.innerText.trim() : (firstSizeBtn ? firstSizeBtn.innerText.trim() : "Mặc định");

    let cart = getCart();

    let existingItem = cart.find(item => item.name === name && item.size === size);

    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cart.push({
            name: name,
            price: price,
            img: img,
            size: size,
            quantity: 1
        });
    }

    saveCart(cart);
    
    if (typeof openCartPanel === 'function') {
        openCartPanel();
    }
}

//togglecurrentfavorite: thêm hoặc bỏ yêu thích sản phẩm hiện tại
function toggleCurrentFavorite() {
    let urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));
    
    if (productId) {
        if (typeof toggleFavorite === 'function') {
            toggleFavorite(productId);
        } else {
            alert("Lỗi: Không tìm thấy hệ thống Yêu thích. Bạn đã nhúng favourite.js chưa?");
        }
    }
}

//renderrandomrelatedproducts: tải ngẫu nhiên các sản phẩm liên quan
function renderRandomRelatedProducts(currentProductId) {
    let container = document.getElementById('relatedProducts');
    if (!container || typeof productsDatabase === 'undefined') return;

    let availableProducts = productsDatabase.filter(p => p.id !== currentProductId);
    availableProducts.sort(() => 0.5 - Math.random());
    let randomProducts = availableProducts.slice(0, 3);

    let htmlContent = "";
    randomProducts.forEach(p => {
        let priceFormat = p.price.toLocaleString('vi-VN') + '₫';
        htmlContent += `
            <div class="col-10 col-md-4 flex-shrink-0">
                <a href="productDetail.html?id=${p.id}" class="text-decoration-none text-dark related-card">
                    <div class="border-0">
                        <div class="mb-3 bg-light rounded d-flex align-items-center justify-content-center" style="aspect-ratio: 1/1; overflow: hidden;">
                            <img src="${p.img}" class="img-fluid w-100 h-100 object-fit-contain p-3">
                        </div>
                        <h3 class="fw-bold mb-1">${p.name}</h3>
                        <p class="text-secondary mb-1 small fs-6">${p.category} - ${p.gender}</p>
                        <h3 class="fw-bold mt-2 fs-6 text-danger">${priceFormat}</h3>
                    </div>
                </a>
            </div>`;
    });
    container.innerHTML = htmlContent;
}

//selectsize: chọn size sản phẩm
function selectSize(btn) {
    let sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(b => b.classList.remove('active-size'));
    btn.classList.add('active-size');
}

//initproductdetail: tải thông tin chi tiết sản phẩm
function initProductDetail() {
    let urlParams = new URLSearchParams(window.location.search);
    let productId = parseInt(urlParams.get('id'));

    if (typeof productsDatabase !== 'undefined' && productId) {
        let product = productsDatabase.find(p => p.id === productId);
        if (product) {
            document.getElementById('productName').innerText = product.name;
            document.getElementById('productCategory').innerText = product.category + " - " + product.gender;
            document.getElementById('productPrice').innerText = product.price.toLocaleString('vi-VN') + " đ";
            document.getElementById('mainProductImg').src = product.img;
            document.title = product.name + " - Basau Sneakers";
            renderRandomRelatedProducts(productId);
        }
    }

    let currentUserData = localStorage.getItem('currentUser');
    if (currentUserData && currentUserData !== "null") {
        let user = JSON.parse(currentUserData);
        let userText = document.getElementById('userAccountText');
        if (userText) userText.innerText = user.username;
    }
}
window.onload = initProductDetail;