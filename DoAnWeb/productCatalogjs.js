// ============================================================
// HỆ THỐNG QUẢN LÝ DANH MỤC SẢN PHẨM & TÌM KIẾM
// ============================================================

// Các biến toàn cục để ghi nhớ trạng thái
let currentBrand = "all";
let currentSearch = ""; 
let displayedProducts = [];
let currentPage = 1; 
let itemsPerPage = 6;
let isSearchMode = false; 

function selectBrand(element) {
    let tabs = document.querySelectorAll('.brand-tab');
    for (let i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove('active');
    }
    element.classList.add('active');
    currentBrand = element.getAttribute('data-brand');
    
    // Nếu đang tìm kiếm thì không đổi link URL, giữ nguyên cờ
    if(!isSearchMode) {
        window.history.replaceState(null, null, "?brand=" + currentBrand);
    }
    
    applyFilters();
}

function applyFilters() {
    let checkboxes = document.querySelectorAll('.filter-check input[type="checkbox"]');
    let filterGenders = [], filterCategories = [], filterBadges = [], filterPrices = [];

    for (let i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
            let val = checkboxes[i].value;
            if (val === "Nam" || val === "Nữ" || val === "Unisex") 
                filterGenders.push(val);
            else if (val === "Sneakers" || val === "Running" || val === "Classic" || val === "Dép") 
                filterCategories.push(val);
            else if (val === "New Arrival" || val === "Sale Off" || val === "Best Seller") 
                filterBadges.push(val);
            else if (val === "under2m" || val === "2m-4m" || val === "over4m") 
                filterPrices.push(val);
        }
    }

    let pageTitle = document.getElementById('pageTitle');
    if (pageTitle && !isSearchMode) {
        if (filterGenders.length === 1) 
            pageTitle.innerText = filterGenders[0];
        else if (filterGenders.length > 1) 
            pageTitle.innerText = "Nam & Nữ";
        else if (currentBrand !== 'all') 
            pageTitle.innerText = currentBrand;
        else 
            pageTitle.innerText = "Tất cả sản phẩm";
    }

    displayedProducts = [];
    let allProducts = (typeof getAllProducts === 'function') ? getAllProducts() : productsDatabase;

    for (let i = 0; i < allProducts.length; i++) {
        let product = allProducts[i];
        let isValid = true;

        if (currentBrand !== "all" && product.brand !== currentBrand) 
            isValid = false;
        if (filterGenders.length > 0 && !filterGenders.includes(product.gender)) 
            isValid = false;
        if (filterCategories.length > 0 && !filterCategories.includes(product.category)) 
            isValid = false;

        if (filterBadges.length > 0) {
            let pBadge = (product.badge || "").toLowerCase();
            let standardBadge = product.badge; 
            
            if (pBadge.includes("new")) 
                standardBadge = "New Arrival";
            else if (pBadge.includes("sale")) 
                standardBadge = "Sale Off";
            else if (pBadge.includes("best")) 
                standardBadge = "Best Seller";

            if (!filterBadges.includes(standardBadge)) 
                isValid = false;
        }

        if (filterPrices.length > 0) {
            let matchPrice = false;
            for (let j = 0; j < filterPrices.length; j++) {
                let p = filterPrices[j];
                if (p === "under2m" && product.price < 2000000) 
                    matchPrice = true;
                if (p === "2m-4m" && product.price >= 2000000 && product.price <= 4000000) 
                    matchPrice = true;
                if (p === "over4m" && product.price > 4000000) 
                    matchPrice = true;
            }
            if (matchPrice === false) 
                isValid = false;
        }

        if (currentSearch !== "") {
            let searchLower = currentSearch.toLowerCase();
            let nameLower = product.name.toLowerCase();
            let brandLower = product.brand.toLowerCase();
            if (!nameLower.includes(searchLower) && !brandLower.includes(searchLower)) {
                isValid = false;
            }
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
    
    // Nếu bấm xóa tất cả -> Reset luôn cả tìm kiếm
    currentSearch = ""; 
    isSearchMode = false;
    
    let searchInputs = document.querySelectorAll('.custom-search');
    searchInputs.forEach(input => input.value = "");
    
    let pageTitle = document.getElementById('pageTitle');
    if(pageTitle) pageTitle.innerText = "Tất cả sản phẩm";
    
    // Bật lại tab Tất cả
    let allTab = document.querySelector('.brand-tab[data-brand="all"]');
    if(allTab) selectBrand(allTab);
    else applyFilters();
}

function renderProducts() {
    let grid = document.getElementById('productGrid');
    let noResults = document.getElementById('noResults');
    let resultCount = document.getElementById('resultCount');
    let paginationContainer = document.getElementById('phantrang');

    resultCount.innerText = "(" + displayedProducts.length + " sản phẩm)";

    if (displayedProducts.length === 0) {
        grid.innerHTML = "";
        if (paginationContainer) paginationContainer.innerHTML = ""; 
        noResults.classList.remove('d-none');
        return;
    } else {
        noResults.classList.add('d-none');
    }

    let totalPages = Math.ceil(displayedProducts.length / itemsPerPage);
    
    // Tự động lùi trang nếu kết quả mới ít hơn trang hiện tại
    if (currentPage > totalPages) currentPage = 1;
    
    let startIndex = (currentPage - 1) * itemsPerPage;
    let endIndex = startIndex + itemsPerPage;
    if (endIndex > displayedProducts.length) endIndex = displayedProducts.length;

    let htmlContent = "";
    for (let i = startIndex; i < endIndex; i++) {
        let p = displayedProducts[i];
        let priceFormat = p.price.toLocaleString('vi-VN') + "₫";
        let badgeHtml = "";
        if (p.badge && p.badge !== "") {
            let badgeClass = "badge-default"; 
            let badgeStr = p.badge.toLowerCase(); 
            let displayBadge = p.badge; 

            if (badgeStr.includes("new")) {
                badgeClass = "badge-new";
                displayBadge = "New Arrival"; 
            } 
            else if (badgeStr.includes("sale")) {
                badgeClass = "badge-sale";
                displayBadge = "Sale Off";    
            } 
            else if (badgeStr.includes("best")) {
                badgeClass = "badge-bestseller";
                displayBadge = "Best Seller";   
            }
            
            badgeHtml = '<span class="product-badge ' + badgeClass + '">' + displayBadge + '</span>';
        }

        htmlContent += '<a href="productDetail.html?id=' + p.id + '" class="text-decoration-none text-dark">';
        htmlContent += '  <div class="product-card-cat" style="position: relative;">'; 
        htmlContent += badgeHtml; 
        htmlContent += '      <div class="img-wrap"><img src="' + p.img + '" alt="Giày"></div>';
        htmlContent += '      <div class="card-info">';
        htmlContent += '          <h5 class="card-name">' + p.name + '</h5>';
        htmlContent += '          <p class="card-cat-gender">' + p.category + ' - ' + p.gender + '</p>'; 
        htmlContent += '          <p class="card-price">' + priceFormat + '</p>';
        htmlContent += '      </div></div></a>';
    }
    grid.innerHTML = htmlContent;

    let paginationHTML = "";
    if (totalPages > 1) { 
        for (let i = 1; i <= totalPages; i++) {
            if (i === currentPage) {
                paginationHTML += '<button class="btn btn-dark px-3 fw-bold" onclick="changePage(' + i + ')">' + i + '</button>';
            } else {
                paginationHTML += '<button class="btn btn-outline-dark px-3 fw-bold" onclick="changePage(' + i + ')">' + i + '</button>';
            }
        }
    }
    if (paginationContainer) paginationContainer.innerHTML = paginationHTML;
}

function changePage(pageNumber) {
    currentPage = pageNumber; 
    renderProducts(); 
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
} 

// ============================================================
// KHỞI CHẠY (BẮT URL & THANH TÌM KIẾM TRỰC TIẾP)
// ============================================================
window.onload = function() {
    let allCheckboxes = document.querySelectorAll('.filter-check input[type="checkbox"]');
    allCheckboxes.forEach(chk => chk.checked = false);
    
    let urlParams = new URLSearchParams(window.location.search);
    let genderFromUrl = urlParams.get('gender');
    let brandFromUrl = urlParams.get('brand');
    let badgeFromUrl = urlParams.get('badge');
    let categoryFromUrl = urlParams.get('category'); 
    let searchFromUrl = urlParams.get('search'); 

    // Mặc định không search
    isSearchMode = false;
    currentSearch = "";

    if (genderFromUrl) {    
        let checkboxes = document.querySelectorAll('.filter-check input[type="checkbox"]');
        checkboxes.forEach(chk => { if (chk.value === genderFromUrl) chk.checked = true; });
    } 
    if (badgeFromUrl){
        let checkboxes = document.querySelectorAll('.filter-check input[type="checkbox"]');
        checkboxes.forEach(chk => { if (chk.value === badgeFromUrl) chk.checked = true; });
    }
    if (categoryFromUrl){
        let checkboxes = document.querySelectorAll('.filter-check input[type="checkbox"]');
        checkboxes.forEach(chk => { if (chk.value === categoryFromUrl) chk.checked = true; });
    }

    let pageTitle = document.getElementById('pageTitle');

    // NẾU CÓ URL SEARCH (Từ trang khác đá qua)
    if (searchFromUrl) {
        currentSearch = searchFromUrl;
        isSearchMode = true;
        if (pageTitle) pageTitle.innerText = "Kết quả: '" + currentSearch + "'";
        
        // Cập nhật lại cái thanh input search cho khách dễ nhìn
        let searchInputs = document.querySelectorAll('.custom-search');
        searchInputs.forEach(input => input.value = currentSearch);
    } 

    let isBrandSelected = false;
    if (brandFromUrl) {
        let tabs = document.querySelectorAll('.brand-tab');
        for (let i = 0; i < tabs.length; i++) {
            if (tabs[i].getAttribute('data-brand') === brandFromUrl) {
                selectBrand(tabs[i]);
                isBrandSelected = true;
                break;
            }
        }
    } 
    
    if (!isBrandSelected) applyFilters();

    // LẮNG NGHE SỰ KIỆN GÕ TÌM KIẾM TRỰC TIẾP TẠI TRANG
    let searchInputs = document.querySelectorAll('.custom-search');
    for (let i = 0; i < searchInputs.length; i++) {
        // Gõ Enter thì lọc luôn (Hoặc xóa trống rồi Enter thì reset lại)
        searchInputs[i].addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                let keyword = this.value.trim();
                
                if (keyword !== '') {
                    currentSearch = keyword;
                    isSearchMode = true;
                    if (pageTitle) pageTitle.innerText = "Kết quả: '" + currentSearch + "'";
                } else {
                    // KHÁCH XÓA HẾT CHỮ VÀ NHẤN ENTER -> TRỞ LẠI NHƯ CŨ
                    currentSearch = "";
                    isSearchMode = false;
                    if (pageTitle) pageTitle.innerText = "Tất cả sản phẩm";
                }
                
                currentPage = 1; // Reset trang về 1
                applyFilters();
            }
        });
        
        // Bắt luôn trường hợp khách bấm nút Xóa (dấu X) trên thanh tìm kiếm
        searchInputs[i].addEventListener('search', function() {
            if (this.value === '') {
                currentSearch = "";
                isSearchMode = false;
                if (pageTitle) pageTitle.innerText = "Tất cả sản phẩm";
                applyFilters();
            }
        });
    }
};