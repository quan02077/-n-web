//getallproducts: lấy tất cả sản phẩm
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

//patchproductsdatabase: ghi đè lại dữ liệu tạm thời
function patchProductsDatabase() {
    if (typeof productsDatabase === 'undefined') return;
    let patched = getAllProducts();
    productsDatabase.length = 0;
    for (let i = 0; i < patched.length; i++) productsDatabase.push(patched[i]);
}

//switchadmintab: chuyển đổi tab giao diện admin
function switchAdminTab(tab) {
    let tabs = ['add', 'edit', 'delete', 'orders', 'stats'];
    for (let i = 0; i < tabs.length; i++) {
        let t = tabs[i];
        let panel = document.getElementById('adm-panel-' + t);
        let btn = document.getElementById('adm-tab-' + t);

        if (panel) panel.classList.remove('active');
        if (btn) btn.classList.remove('active');

        if (t === tab) {
            if (panel) panel.classList.add('active');
            if (btn) btn.classList.add('active');
        }
    }
    if (tab === 'edit') loadEditList();
    if (tab === 'delete') loadDeleteList();
    if (tab === 'orders') loadOrdersList();
    if (tab === 'stats') loadStatsDashboard();
}

let _addSizes = [];
let _editSizes = [];
let currentEditId = null;

let ALL_SIZES = ['EU 35', 'EU 35.5', 'EU 36', 'EU 36.5', 'EU 37', 'EU 37.5', 'EU 38', 'EU 38.5', 'EU 39', 'EU 39.5', 'EU 40', 'EU 40.5', 'EU 41', 'EU 41.5', 'EU 42', 'EU 42.5', 'EU 43', 'EU 44', 'EU 44.5', 'EU 45', 'EU 46', 'EU 47'];

//buildsizegrid: tạo danh sách nút chọn size
function buildSizeGrid(mode) {
    let grid = document.getElementById(mode + 'SizeGrid');
    let htmlContent = "";
    for (let i = 0; i < ALL_SIZES.length; i++) {
        htmlContent += '<button type="button" class="adm-size-chip" data-size="' + ALL_SIZES[i] + '" onclick="toggleSize(\'' + mode + '\',this)">' + ALL_SIZES[i] + '</button>';
    }
    grid.innerHTML = htmlContent;
}

//togglesize: bật tắt chọn size riêng lẻ
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

//quicksize: chọn nhanh nhóm size có sẵn
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

    let grid = document.getElementById(mode + 'SizeGrid');
    let buttons = grid.querySelectorAll('.adm-size-chip');
    for (let i = 0; i < buttons.length; i++) {
        let sz = buttons[i].getAttribute('data-size');
        if (arr.indexOf(sz) !== -1) buttons[i].classList.add('on');
        else buttons[i].classList.remove('on');
    }
}

//setsizegrid: đặt danh sách size có sẵn vào grid
function setSizeGrid(mode, sizes) {
    let arr = (mode === 'add') ? _addSizes : _editSizes;
    arr.length = 0;
    for (let i = 0; i < sizes.length; i++) arr.push(sizes[i]);
    quickSize(mode, 'custom');
}

//selectbadge: chọn nhãn dán cho sản phẩm
function selectBadge(mode, btn) {
    let buttons = document.getElementById(mode + 'BadgeRow').querySelectorAll('.adm-badge-opt');
    for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('selected');
    btn.classList.add('selected');
    document.getElementById(mode + '_badge').value = btn.getAttribute('data-v');
}

//setbadge: đặt nhãn dán cho sản phẩm theo giá trị
function setBadge(mode, val) {
    if (!val) val = '';
    let buttons = document.getElementById(mode + 'BadgeRow').querySelectorAll('.adm-badge-opt');
    for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].getAttribute('data-v') === val) buttons[i].classList.add('selected');
        else buttons[i].classList.remove('selected');
    }
    document.getElementById(mode + '_badge').value = val;
}

//submitaddproduct: thêm sản phẩm mới
function submitAddProduct() {
    let name = document.getElementById('add_name').value.trim();
    let price = parseInt(document.getElementById('add_price').value) || 0;
    let oldPrice = parseInt(document.getElementById('add_oldPrice').value) || 0;
    let img = document.getElementById('add_img').value.trim();

    if (name === "" || price === 0 || img === "") {
        Swal.fire('Lỗi', 'Vui lòng điền đầy đủ Tên, Giá và Ảnh!', 'warning');
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

    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã thêm "' + name + '" thành công!',
        showConfirmButton: false,
        timer: 1400
    }).then(function () {
        location.reload();
    });
}

//selectproducttoedit: chọn sản phẩm để sửa
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

//submiteditproduct: xác nhận sửa sản phẩm
function submitEditProduct() {
    if (currentEditId === null) return;

    let name = document.getElementById('edit_name').value.trim();
    let price = parseInt(document.getElementById('edit_price').value) || 0;
    let img = document.getElementById('edit_img').value.trim();

    if (name === "" || price === 0 || img === "") {
        Swal.fire('Lỗi', 'Vui lòng điền đầy đủ Tên, Giá và Ảnh!', 'warning');
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
    Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: 'Đã cập nhật sản phẩm thành công!',
        showConfirmButton: false,
        timer: 1400
    }).then(function () {
        location.reload();
    });
}

//deleteproduct: xóa sản phẩm
function deleteProduct(id, btn) {
    Swal.fire({
        title: 'Xóa sản phẩm?',
        text: 'Bạn có chắc chắn muốn xóa sản phẩm này không?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#e74c3c',
        cancelButtonColor: '#95a5a6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then(function (result) {
        if (result.isConfirmed) {
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

            Swal.fire({
                icon: 'success',
                title: 'Đã xóa!',
                text: 'Sản phẩm đã được xóa thành công.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

//loadeditlist: tải danh sách sản phẩm để sửa
function loadEditList() {
    renderProductList('editList', getAllProducts(), 'edit');
    document.getElementById('editFormWrap').style.display = 'none';
    currentEditId = null;
}

//loaddeletelist: tải danh sách sản phẩm để xóa
function loadDeleteList() {
    renderProductList('deleteList', getAllProducts(), 'delete');
}

//renderproductlist: render danh sách sản phẩm ra màn hình
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

//loadorderslist: tải danh sách đơn hàng
function loadOrdersList() {
    let container = document.getElementById('orderListContainer');
    if (!container) return;

    let orders = JSON.parse(localStorage.getItem('basau_orders')) || [];
    if (orders.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:40px; color:#888; font-size: 16px;">Chưa có đơn hàng nào trên hệ thống.</div>';
        return;
    }

    let htmlStr = '';
    [...orders].reverse().forEach(o => {
        let badgeColor = o.status.includes('Đã thanh toán') ? '#27ae60' : '#f39c12';
        htmlStr += `
            <div style="border:1px solid #eee; padding:20px; margin-bottom:15px; border-radius:10px; background:#fafafa; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #ddd; padding-bottom: 10px; margin-bottom: 10px;">
                    <strong style="color:#111; font-size: 16px; font-family: 'Oswald', sans-serif;">ĐƠN HÀNG: ${o.id}</strong>
                    <span style="background:${badgeColor}; color:#fff; padding:5px 12px; border-radius:50px; font-size:12px; font-weight:bold; letter-spacing: 0.5px;">${o.status.toUpperCase()}</span>
                </div>
                <div style="font-size:15px; color:#444; line-height: 1.8;">
                    Khách hàng: <strong>${o.customer}</strong> <br>
                    Điện thoại: <strong>${o.phone}</strong> <br>
                    Địa chỉ: ${o.address} <br>
                    Thời gian đặt: <span style="color:#888;">${o.date}</span> <br>
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #ccc; display:flex; justify-content: space-between; align-items: center;">
                        <span style="font-weight: bold; color: #555;">TỔNG THANH TOÁN:</span>
                        <strong style="color:#dc3545; font-size:20px;">${o.total.toLocaleString('vi-VN')}₫</strong>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlStr;
}

//filteradminlist: tìm kiếm sản phẩm trong admin
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

//checkadminaccess: kiểm tra quyền truy cập admin
function checkAdminAccess() {
    let qlBtn = document.getElementById('QL_btn');
    if (!qlBtn) return;

    let userData = localStorage.getItem('currentUser');
    let user = userData ? JSON.parse(userData) : null;

    if (user !== null && user.role === 'Nhân viên') {
        qlBtn.parentElement.style.setProperty('display', 'block', 'important');
    } else {
        qlBtn.parentElement.style.setProperty('display', 'none', 'important');
    }
}
checkAdminAccess();

//initadminpage: khởi tạo trang admin
function initAdminPage() {
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
}
initAdminPage();

patchProductsDatabase();

//viewmyorders: xem danh sách đơn hàng cá nhân
function viewMyOrders() {
    let userData = localStorage.getItem('currentUser');
    if (!userData) return;
    let user = JSON.parse(userData);

    let allOrders = JSON.parse(localStorage.getItem('basau_orders')) || [];
    let myOrders = allOrders.filter(o => o.email === user.email);

    if (myOrders.length === 0) {
        Swal.fire('Trống', 'Chưa có đơn hàng nào cả. Đi mua sắm ngay thôi!', 'info');
        return;
    }

    let html = '<div style="text-align:left; max-height:450px; overflow-y:auto; padding-right:10px;">';
    myOrders.slice().reverse().forEach(o => {
        let badgeColor = o.status.includes('Đã thanh toán') ? '#27ae60' : '#f39c12';
        html += `
            <div style="border:1px solid #ddd; padding:15px; margin-bottom:12px; border-radius:10px; background:#fafafa; font-family: sans-serif;">
                <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                    <strong style="color:#333;">Mã: ${o.id}</strong>
                    <span style="background:${badgeColor}; color:#fff; padding:2px 8px; border-radius:5px; font-size:12px; font-weight:bold;">${o.status}</span>
                </div>
                <div style="font-size:14px; color:#555;">
                    Ngày đặt: <strong>${o.date}</strong> <br>
                    Tổng tiền: <strong style="color:#dc3545; font-size:16px;">${o.total.toLocaleString('vi-VN')}₫</strong>
                </div>
            </div>`;
    });
    html += '</div>';

    Swal.fire({
        title: 'LỊCH SỬ MUA HÀNG',
        html: html,
        width: '550px',
        showCloseButton: true,
        showConfirmButton: false
    });
}

let _myChartBrands = null;
let _myChartRevenue = null;

//loadstatsdashboard: tải biểu đồ và số liệu thống kê
function loadStatsDashboard() {
    let products = getAllProducts();
    let orders = JSON.parse(localStorage.getItem('basau_orders')) || [];

    let totalRevenue = 0;
    let totalPaidOrders = 0;
    orders.forEach(o => {
        if (o.status && (o.status.includes('Đã thanh toán') || o.status.includes('🟢'))) {
            totalRevenue += o.total;
            totalPaidOrders++;
        }
    });

    let revEl = document.getElementById('statsTotalRevenue');
    let ordEl = document.getElementById('statsTotalOrders');
    let prodEl = document.getElementById('statsTotalProducts');

    if (revEl) revEl.textContent = totalRevenue.toLocaleString('vi-VN') + '₫';
    if (ordEl) ordEl.textContent = orders.length + ' đơn';
    if (prodEl) prodEl.textContent = products.length + ' mẫu';

    let brandCounts = {};
    products.forEach(p => {
        let b = p.brand || 'Khác';
        brandCounts[b] = (brandCounts[b] || 0) + 1;
    });

    let brandLabels = Object.keys(brandCounts);
    let brandData = Object.values(brandCounts);

    let ctxBrands = document.getElementById('chartBrands');
    if (ctxBrands) {
        if (_myChartBrands) _myChartBrands.destroy();

        _myChartBrands = new Chart(ctxBrands, {
            type: 'pie',
            data: {
                labels: brandLabels,
                datasets: [{
                    label: 'Số lượng mẫu',
                    data: brandData,
                    backgroundColor: ['#ff9999', '#66b3ff', '#99ff99', '#ffcc99', '#c2c2f0', '#ffb3e6', '#c4e17f']
                }]
            }
        });
    }

    let recentOrders = orders.slice(-7);
    if (recentOrders.length === 0) {
        recentOrders = [
            { id: 'Đơn 1', total: 1200000 },
            { id: 'Đơn 2', total: 2500000 },
            { id: 'Đơn 3', total: 950000 }
        ];
    }

    let orderLabels = [];
    let orderData = [];

    recentOrders.forEach(o => {
        let shortId = o.id.length > 8 ? 'ORD...' + o.id.slice(-4) : o.id;
        orderLabels.push(shortId);
        orderData.push(o.total);
    });

    let ctxRevenue = document.getElementById('chartRevenue');
    if (ctxRevenue) {
        if (_myChartRevenue) _myChartRevenue.destroy();

        _myChartRevenue = new Chart(ctxRevenue, {
            type: 'bar',
            data: {
                labels: orderLabels,
                datasets: [{
                    label: 'Giá trị đơn hàng (VNĐ)',
                    data: orderData,
                    backgroundColor: '#36a2eb'
                }]
            }
        });
    }
}