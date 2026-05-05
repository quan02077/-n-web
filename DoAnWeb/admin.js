function getAllProducts() {
    let base = [];
    if (typeof productsDatabase !== 'undefined') {
        for (let i = 0; i < productsDatabase.length; i++) {
            base.push(productsDatabase[i]);
        }
    }

    let addedData = localStorage.getItem('basau_addedProducts');
    let added = addedData ? JSON.parse(addedData) : [];

    let editedData = localStorage.getItem('basau_editedProducts');
    let edited = editedData ? JSON.parse(editedData) : {};

    let deletedData = localStorage.getItem('basau_deletedIds');
    let deleted = deletedData ? JSON.parse(deletedData) : [];

    let allItems = [];
    for (let i = added.length - 1; i >= 0; i--) {
        allItems.push(added[i]);
    }
    for (let i = 0; i < base.length; i++) {
        let isDuplicate = false;
        for (let j = 0; j < added.length; j++) {
            if (base[i].id === added[j].id) {
                isDuplicate = true;
                break;
            }
        }
        if (isDuplicate === false) {
            allItems.push(base[i]);
        }
    }

    let finalResult = [];
    for (let i = 0; i < allItems.length; i++) {
        let item = allItems[i]; 

        if (deleted.indexOf(item.id) === -1) {
            if (edited[item.id]) {
                let e = edited[item.id];
                if (e.name) item.name = e.name;
                if (e.brand) item.brand = e.brand;
                if (e.category) item.category = e.category;
                if (e.gender) item.gender = e.gender;
                if (e.price) item.price = e.price;
                if (e.oldPrice !== undefined) item.oldPrice = e.oldPrice;
                if (e.badge !== undefined) item.badge = e.badge;
                if (e.img) item.img = e.img;
                if (e.thumbnails) item.thumbnails = e.thumbnails;
                if (e.sizes) item.sizes = e.sizes;
            }
            finalResult.push(item);
        }
    }
    return finalResult;
}

function patchProductsDatabase() {
    if (typeof productsDatabase === 'undefined') return;
    let patched = getAllProducts();
    productsDatabase.length = 0;
    for (let i = 0; i < patched.length; i++) productsDatabase.push(patched[i]);
}

// ----------------------------------------------------
// 2. CHUYỂN ĐỔI TAB GIAO DIỆN (Thêm, Sửa, Xóa)
// ----------------------------------------------------
function switchAdminTab(tab) {
    let tabs = ['add', 'edit', 'delete'];
    for (let i = 0; i < tabs.length; i++) {
        let t = tabs[i];
        document.getElementById('adm-panel-' + t).classList.remove('active');
        document.getElementById('adm-tab-' + t).classList.remove('active');

        if (t === tab) {
            document.getElementById('adm-panel-' + t).classList.add('active');
            document.getElementById('adm-tab-' + t).classList.add('active');
        }
    }
    if (tab === 'edit') loadEditList();
    if (tab === 'delete') loadDeleteList();
}

// ----------------------------------------------------
// 3. QUẢN LÝ KÍCH CỠ (SIZE), NHÃN DÁN
// ----------------------------------------------------
let _addSizes = [];
let _editSizes = [];
let currentEditId = null;

let ALL_SIZES = ['EU 35', 'EU 35.5', 'EU 36', 'EU 36.5', 'EU 37', 'EU 37.5', 'EU 38', 'EU 38.5', 'EU 39', 'EU 39.5', 'EU 40', 'EU 40.5', 'EU 41', 'EU 41.5', 'EU 42', 'EU 42.5', 'EU 43', 'EU 44', 'EU 44.5', 'EU 45', 'EU 46', 'EU 47'];

function buildSizeGrid(mode) {
    let grid = document.getElementById(mode + 'SizeGrid');
    let htmlContent = "";
    for (let i = 0; i < ALL_SIZES.length; i++) {
        htmlContent += '<button type="button" class="adm-size-chip" data-size="' + ALL_SIZES[i] + '" onclick="toggleSize(\'' + mode + '\',this)">' + ALL_SIZES[i] + '</button>';
    }
    grid.innerHTML = htmlContent;
}

function toggleSize(mode, btn) {
    let arr = (mode === 'add') ? _addSizes : _editSizes;
    let sz = btn.getAttribute('data-size');
    let index = arr.indexOf(sz);

    if (index === -1) {
        arr.push(sz);
        btn.classList.add('on');
    } else {
        arr.splice(index, 1);
        btn.classList.remove('on');
    }
}

function quickSize(mode, preset) {
    let arr = (mode === 'add') ? _addSizes : _editSizes;
    let men = ['EU 39', 'EU 39.5', 'EU 40', 'EU 40.5', 'EU 41', 'EU 41.5', 'EU 42', 'EU 42.5', 'EU 43', 'EU 44', 'EU 44.5', 'EU 45', 'EU 46'];
    let women = ['EU 35', 'EU 35.5', 'EU 36', 'EU 36.5', 'EU 37', 'EU 37.5', 'EU 38', 'EU 38.5', 'EU 39', 'EU 39.5', 'EU 40'];

    let target = [];
    if (preset === 'all') target = ALL_SIZES;
    else if (preset === 'men') target = men;
    else if (preset === 'women') target = women;

    arr.length = 0;
    if (preset !== 'clear') {
        for (let i = 0; i < target.length; i++) arr.push(target[i]);
    }

    // Cập nhật giao diện
    let grid = document.getElementById(mode + 'SizeGrid');
    let buttons = grid.querySelectorAll('.adm-size-chip');
    for (let i = 0; i < buttons.length; i++) {
        let sz = buttons[i].getAttribute('data-size');
        if (arr.indexOf(sz) !== -1) buttons[i].classList.add('on');
        else buttons[i].classList.remove('on');
    }
}

function setSizeGrid(mode, sizes) {
    let arr = (mode === 'add') ? _addSizes : _editSizes;
    arr.length = 0;
    for (let i = 0; i < sizes.length; i++) arr.push(sizes[i]);
    quickSize(mode, 'custom'); // Tái sử dụng hàm trên để update UI
}

function selectBadge(mode, btn) {
    let buttons = document.getElementById(mode + 'BadgeRow').querySelectorAll('.adm-badge-opt');
    for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('selected');
    btn.classList.add('selected');
    document.getElementById(mode + '_badge').value = btn.getAttribute('data-v');
}

function setBadge(mode, val) {
    if (!val) val = '';
    let buttons = document.getElementById(mode + 'BadgeRow').querySelectorAll('.adm-badge-opt');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-v') === val) buttons[i].classList.add('selected');
        else buttons[i].classList.remove('selected');
    }
    document.getElementById(mode + '_badge').value = val;
}

// ----------------------------------------------------
// 4. XỬ LÝ LƯU DỮ LIỆU (THÊM, SỬA, XÓA)
// ----------------------------------------------------
// ----------------------------------------------------
// XỬ LÝ LƯU DỮ LIỆU (THÊM MỚI SẢN PHẨM)
// ----------------------------------------------------
function submitAddProduct() {
    let name = document.getElementById('add_name').value.trim();
    let price = parseInt(document.getElementById('add_price').value) || 0;
    let oldPrice = parseInt(document.getElementById('add_oldPrice').value) || 0;
    let img = document.getElementById('add_img').value.trim();

    if (name === "" || price === 0 || img === "") {
        showAdminToast('⚠ Vui lòng điền đầy đủ Tên, Giá và Ảnh!', '#e74c3c');
        return;
    }
    let maxId = 0;
    if (typeof productsDatabase !== 'undefined') {
        for (let i = 0; i < productsDatabase.length; i++) {
            if (productsDatabase[i].id > maxId) maxId = productsDatabase[i].id;
        }
    }
    
    let addedData = localStorage.getItem('basau_addedProducts');
    let added = addedData ? JSON.parse(addedData) : [];
    
    for (let i = 0; i < added.length; i++) {
        if (added[i].id > maxId) maxId = added[i].id;
    }

    let badgeInput = document.getElementById('add_badge');

    let newProduct = {
        id: maxId + 1,
        brand: document.getElementById('add_brand').value,
        name: name,
        category: document.getElementById('add_category').value,
        gender: document.getElementById('add_gender').value,
        price: price,
        oldPrice: oldPrice,
        badge: badgeInput ? badgeInput.value : "",
        img: img,
        thumbnails: [img],
        sizes: _addSizes.slice()
    };

    added.push(newProduct);
    localStorage.setItem('basau_addedProducts', JSON.stringify(added));

    showAdminToast('✅ Đã thêm "' + name + '" thành công!', '#27ae60');
    setTimeout(function () { location.reload(); }, 1400);
}

function selectProductToEdit(id) {
    let products = getAllProducts();
    let p = null;
    for (let i = 0; i < products.length; i++) {
        if (products[i].id === id) { p = products[i]; break; }
    }
    if (!p) return;

    currentEditId = id;

    document.getElementById('edit_name').value = p.name;
    document.getElementById('edit_brand').value = p.brand;
    document.getElementById('edit_category').value = p.category;
    document.getElementById('edit_gender').value = p.gender;
    document.getElementById('edit_price').value = p.price;
    document.getElementById('edit_oldPrice').value = p.oldPrice || 0;
    document.getElementById('edit_img').value = p.img;

    setBadge('edit', p.badge || '');
    setSizeGrid('edit', p.sizes || []);

    document.getElementById('editFormWrap').style.display = 'block';
    document.getElementById('editFormWrap').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitEditProduct() {
    if (currentEditId === null) return;

    let name = document.getElementById('edit_name').value.trim();
    let price = parseInt(document.getElementById('edit_price').value) || 0;
    let img = document.getElementById('edit_img').value.trim();

    if (name === "" || price === 0 || img === "") {
        showAdminToast('⚠ Vui lòng điền đầy đủ Tên, Giá và Ảnh!', '#e74c3c');
        return;
    }

    let editedData = localStorage.getItem('basau_editedProducts');
    let edited = editedData ? JSON.parse(editedData) : {};

    edited[currentEditId] = {
        name: name,
        brand: document.getElementById('edit_brand').value,
        category: document.getElementById('edit_category').value,
        gender: document.getElementById('edit_gender').value,
        price: price,
        oldPrice: parseInt(document.getElementById('edit_oldPrice').value) || 0,
        badge: document.getElementById('edit_badge').value,
        img: img,
        thumbnails: [img],
        sizes: _editSizes.slice()
    };

    localStorage.setItem('basau_editedProducts', JSON.stringify(edited));
    showAdminToast('✅ Đã cập nhật sản phẩm thành công!', '#27ae60');
    setTimeout(function () { location.reload(); }, 1400);
}

function deleteProduct(id, btn) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;

    let deletedData = localStorage.getItem('basau_deletedIds');
    let deletedIds = deletedData ? JSON.parse(deletedData) : [];

    if (deletedIds.indexOf(id) === -1) {
        deletedIds.push(id);
        localStorage.setItem('basau_deletedIds', JSON.stringify(deletedIds));
    }

    let row = btn.closest('.adm-product-row');
    row.style.opacity = '.35';
    row.style.pointerEvents = 'none';
    btn.textContent = '✓ Đã xóa';

    patchProductsDatabase();
    showAdminToast('🗑 Đã xóa sản phẩm thành công!', '#e74c3c');
}

// ----------------------------------------------------
// 5. HIỂN THỊ DANH SÁCH & THÔNG BÁO
// ----------------------------------------------------
function loadEditList() {
    renderProductList('editList', getAllProducts(), 'edit');
    document.getElementById('editFormWrap').style.display = 'none';
    currentEditId = null;
}   

function loadDeleteList() {
    renderProductList('deleteList', getAllProducts(), 'delete');
}

function renderProductList(containerId, products, mode) {
    let container = document.getElementById(containerId);
    let htmlContent = "";
    for (let i = 0; i < products.length; i++) {
        let p = products[i];
        let nameLower = p.name.toLowerCase();
        let priceFormat = p.price.toLocaleString('vi-VN') + '₫';
        let badgeHtml = p.badge ? '<span style="font-size:10px;padding:2px 8px;border-radius:50px;background:#f0f0f0;color:#888;font-weight:700;margin-left:6px;">' + p.badge.toUpperCase() + '</span>' : '';

        if (mode === 'delete') {
            htmlContent += '<div class="adm-product-row" data-name="' + nameLower + '">';
            htmlContent += '  <img src="' + p.img + '" class="adm-product-img">';
            htmlContent += '  <div style="flex:1;min-width:0;">';
            htmlContent += '    <div class="adm-row-name">' + p.name + badgeHtml + '</div>';
            htmlContent += '    <div class="adm-row-sub">' + p.brand + ' · ' + p.category + ' · ' + p.gender + '</div>';
            htmlContent += '    <div class="adm-row-price">' + priceFormat + '</div>';
            htmlContent += '  </div>';
            htmlContent += '  <button class="adm-del-btn" onclick="deleteProduct(' + p.id + ', this)">🗑 Xóa</button>';
            htmlContent += '</div>';
        } else {
            htmlContent += '<div class="adm-product-row" data-name="' + nameLower + '" onclick="selectProductToEdit(' + p.id + ')" style="cursor:pointer;">';
            htmlContent += '  <img src="' + p.img + '" class="adm-product-img">';
            htmlContent += '  <div style="flex:1;min-width:0;">';
            htmlContent += '    <div class="adm-row-name">' + p.name + badgeHtml + '</div>';
            htmlContent += '    <div class="adm-row-sub">' + p.brand + ' · ' + p.category + ' · ' + p.gender + '</div>';
            htmlContent += '    <div class="adm-row-price">' + priceFormat + '</div>';
            htmlContent += '  </div>';
            htmlContent += '  <span style="color:#ccc;font-size:20px;">›</span>';
            htmlContent += '</div>';
        }
    }
    container.innerHTML = htmlContent;
}

function filterAdminList(mode) {
    let searchId = (mode === 'edit') ? 'editSearch' : 'deleteSearch';
    let listId = (mode === 'edit') ? 'editList' : 'deleteList';

    let query = document.getElementById(searchId).value.toLowerCase();
    let rows = document.getElementById(listId).querySelectorAll('.adm-product-row');

    for (let i = 0; i < rows.length; i++) {
        let rowName = rows[i].getAttribute('data-name');
        if (rowName.indexOf(query) !== -1) rows[i].style.display = '';
        else rows[i].style.display = 'none';
    }
}

function showAdminToast(msg, bg) {
    let t = document.createElement('div');
    t.className = 'adm-toast';
    t.style.background = bg || '#111';
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.classList.add('show'); }, 30);
    setTimeout(function () { t.classList.remove('show'); setTimeout(function () { t.remove(); }, 400); }, 2600);
}

// ----------------------------------------------------
// KHỞI ĐỘNG VÀ KIỂM TRA QUYỀN TRUY CẬP
// ----------------------------------------------------
function checkAdminAccess() {
    let qlBtn = document.getElementById('QL_btn');
    if (!qlBtn) return; // Trang nào không có nút này thì bỏ qua

    let userData = localStorage.getItem('currentUser');
    let user = userData ? JSON.parse(userData) : null;

    // ĐIỀU KIỆN VÀNG: Chỉ khi có đăng nhập VÀ phải là "Nhân viên"
    if (user !== null && user.role === 'Nhân viên') {
        qlBtn.parentElement.style.setProperty('display', 'block', 'important');
    } else {
        // Tất cả các trường hợp: Chưa đăng nhập, Khách hàng, v.v. -> ẨN HẾT
        qlBtn.parentElement.style.setProperty('display', 'none', 'important');
    }
}

checkAdminAccess();

document.addEventListener('DOMContentLoaded', function () {
    if (typeof checkAdminAccess === 'function') {
        checkAdminAccess();
    }

    let label = document.getElementById('adminUserLabel');
    if (label) {
        let userData = localStorage.getItem('currentUser');
        let user = userData ? JSON.parse(userData) : null;

        if (user) {
            label.textContent = '👤 ' + user.username + '  ·  ' + user.role;
            patchProductsDatabase();
            buildSizeGrid('add');
            buildSizeGrid('edit');
            switchAdminTab('add');
        } else {
            window.location.href = "login.html";
        }
    }
});

patchProductsDatabase();