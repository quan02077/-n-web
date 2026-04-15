// Các biến toàn cục để ghi nhớ trạng thái
let currentBrand = "all";
let displayedProducts = [];
let currentPage = 1; 
let itemsPerPage = 6;

function selectBrand(element) {
    let tabs = document.querySelectorAll('.brand-tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    element.classList.add('active');

    currentBrand = element.getAttribute('data-brand');
    let pageTitle = document.getElementById('pageTitle');
    
    if (currentBrand === 'all') {
        pageTitle.innerText = "Tất cả sản phẩm";
    } else {
        pageTitle.innerText = "Giày " + currentBrand;
    }
    applyFilters();
}

function applyFilters() {
    let checkboxes = document.querySelectorAll('.filter-check input[type="checkbox"]');
    
    let filterGenders = [];
    let filterCategories = [];
    let filterPrices = [];

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
            let val = checkboxes[i].value;
            if (val === "Nam" || val === "Nữ" || val === "Unisex") {
                filterGenders.push(val);
            } else if (val === "Sneakers" || val === "Running" || val === "Classic" || val === "Dép" || val === "Lifestyle") {
                filterCategories.push(val);
            } else if (val === "under2m" || val === "2m-4m" || val === "over4m") {
                filterPrices.push(val);
            }
        }
    }

    displayedProducts = [];

    // Dùng mảng productsDatabase từ file data.js
    for (let i = 0; i < productsDatabase.length; i++) {
        let product = productsDatabase[i];
        let isValid = true;

        if (currentBrand !== "all" && product.brand !== currentBrand) isValid = false;

        if (filterGenders.length > 0) {
            let matchGender = false;
            for (let j = 0; j < filterGenders.length; j++) {
                if (product.gender === filterGenders[j]) matchGender = true;
            }
            if (matchGender === false) isValid = false;
        }

        if (filterCategories.length > 0) {
            let matchCat = false;
            for (let j = 0; j < filterCategories.length; j++) {
                if (product.category === filterCategories[j]) matchCat = true;
            }
            if (matchCat === false) isValid = false;
        }

        if (filterPrices.length > 0) {
            let matchPrice = false;
            for (let j = 0; j < filterPrices.length; j++) {
                let p = filterPrices[j];
                if (p === "under2m" && product.price < 2000000) matchPrice = true;
                if (p === "2m-4m" && product.price >= 2000000 && product.price <= 4000000) matchPrice = true;
                if (p === "over4m" && product.price > 4000000) matchPrice = true;
            }
            if (matchPrice === false) isValid = false;
        }

        if (isValid === true) {
            displayedProducts.push(product);
        }
    }
    applySort();
}

function applySort() {
    let sortValue = document.getElementById('sortSelect').value;

    if (sortValue === "price-asc") {
        displayedProducts.sort(function(a, b) { return a.price - b.price; });
    } else if (sortValue === "price-desc") {
        displayedProducts.sort(function(a, b) { return b.price - a.price; });
    }

    renderProducts();
}

function clearAllFilters() {
    let checkboxes = document.querySelectorAll('.filter-check input[type="checkbox"]');
    for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
    applyFilters();
}

function renderProducts() {
    let grid = document.getElementById('productGrid');
    let noResults = document.getElementById('noResults');
    let resultCount = document.getElementById('resultCount');
    let paginationContainer = document.getElementById('phantrang');

    resultCount.innerText = "(" + displayedProducts.length + " sản phẩm)";

    if (displayedProducts.length === 0) {
        grid.innerHTML = "";
        paginationContainer.innerHTML = ""; // Không có giày thì giấu luôn nút bấm
        noResults.classList.remove('d-none');
        return;
    } else {
        noResults.classList.add('d-none');
    }

    // --- TÍNH TOÁN TOÁN HỌC CHO PHÂN TRANG ---
    // 1. Tính tổng số trang (Ví dụ: 9 giày / 4 = 2.25, làm tròn lên là 3 trang)
    let totalPages = Math.ceil(displayedProducts.length / itemsPerPage);

    // 2. Tính vị trí bắt đầu và kết thúc của vòng lặp
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;

    // Chặn lỗi nếu trang cuối không đủ 4 đôi giày
    if (endIndex > displayedProducts.length) {
        endIndex = displayedProducts.length;
    }

    // --- BẮT ĐẦU VẼ GIÀY ---
    let htmlContent = "";
    for (let i = startIndex; i < endIndex; i++) {
        let p = displayedProducts[i];

        let priceFormat = p.price.toLocaleString('vi-VN') + "₫";

        htmlContent += '<a href="productDetail.html?id=' + p.id + '" class="text-decoration-none text-dark">';
        htmlContent += '  <div class="product-card-cat">';
        
        htmlContent += '      <div class="img-wrap">';
        htmlContent += '          <img src="' + p.img + '" alt="Giày">';
        htmlContent += '      </div>';

        htmlContent += '      <div class="card-info">';
        htmlContent += '          <h5 class="card-name">' + p.name + '</h5>';
        htmlContent += '          <p class="card-cat-gender">' + p.category + ' - ' + p.gender + '</p>'; 
        htmlContent += '          <p class="card-price">' + priceFormat + '</p>';
        htmlContent += '      </div>';

        htmlContent += '  </div>';
        htmlContent += '</a>';
    }
    grid.innerHTML = htmlContent;

    // --- VẼ CÁC NÚT BẤM CHUYỂN TRANG ---
    let paginationHTML = "";
    if (totalPages > 1) { // Chỉ hiện nút nếu có từ 2 trang trở lên
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                // Nút của trang hiện tại (Màu đen đậm)
                paginationHTML += '<button class="btn btn-dark px-3 fw-bold" onclick="changePage(' + i + ')">' + i + '</button>';
            } else {
                // Nút của các trang khác (Viền đen)
                paginationHTML += '<button class="btn btn-outline-dark px-3 fw-bold" onclick="changePage(' + i + ')">' + i + '</button>';
            }
        }
    }
    paginationContainer.innerHTML = paginationHTML;
}

// Hàm này được gọi khi người dùng bấm vào các nút 1, 2, 3...
function changePage(pageNumber) {
    currentPage = pageNumber; // Cập nhật lại số trang hiện tại
    renderProducts(); // Gọi lại hàm vẽ để nó in ra 4 đôi giày mới
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Mượt mà trượt màn hình lên trên cùng
}   

window.onload = function() {
    applyFilters();
};