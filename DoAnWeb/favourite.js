//injectfavhtml: khởi tạo html giao diện yêu thích
function injectFavHTML() {
    if (document.getElementById('favPanel')) return;

    let overlay = document.createElement('div');
    overlay.id = 'favOverlay';
    overlay.onclick = closeFavPanel;

    let panel = document.createElement('div');
    panel.id = 'favPanel';

    panel.innerHTML = `
        <div class="panel-header">
            <div>
                <h5 class="panel-title">🤍 YÊU THÍCH</h5>
                <p id="favHeaderCount" class="panel-subtitle">0 sản phẩm</p>
            </div>
            <button onclick="closeFavPanel()" class="panel-close-btn">✕</button>
        </div>
        <div id="favItemsContainer" class="panel-body"></div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
}

//openfavpanel: mở giao diện yêu thích
function openFavPanel() {
    renderFavPanel();
    document.getElementById('favPanel').classList.add('open');
    document.getElementById('favOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

//closefavpanel: đóng giao diện yêu thích
function closeFavPanel() {
    document.getElementById('favPanel').classList.remove('open');
    document.getElementById('favOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

//togglefavorite: thêm hoặc xóa khỏi danh sách yêu thích
function toggleFavorite(productId) {
    let favs = JSON.parse(localStorage.getItem('basau_fav')) || [];
    let index = favs.indexOf(productId);

    if (index === -1) {
        favs.push(productId);
        showFavToast("Thêm vào yêu thích thành công. 🤍", "#e74c3c");
    } else {
        favs.splice(index, 1);
        showFavToast("Đã bỏ tim khỏi sản phẩm này.", "#555");
    }
    localStorage.setItem('basau_fav', JSON.stringify(favs));
    renderFavPanel();
}

//removefavorite: xóa khỏi danh sách yêu thích
function removeFavorite(productId) {
    let favs = JSON.parse(localStorage.getItem('basau_fav')) || [];
    let index = favs.indexOf(productId);
    if (index !== -1) {
        favs.splice(index, 1);
        localStorage.setItem('basau_fav', JSON.stringify(favs));
        renderFavPanel();
    }
}

//renderfavpanel: tải danh sách sản phẩm yêu thích ra màn hình
function renderFavPanel() {
    let favIds = JSON.parse(localStorage.getItem('basau_fav')) || [];
    let container = document.getElementById('favItemsContainer');
    let countEl = document.getElementById('favHeaderCount');
    if (!container) return;

    if (countEl) countEl.innerText = favIds.length + ' sản phẩm';

    if (favIds.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:70px 20px; color:#bbb;">
                <div style="font-size:64px; margin-bottom:18px; filter:grayscale(1);">🤍</div>
                <h5 style="color:#888;">Chưa có sản phẩm nào</h5>
                <p style="font-size:14px; margin-bottom:15px;">Hãy thả tim những đôi giày bạn thích nhé!</p>
                <button onclick="closeFavPanel()" class="btn btn-dark rounded-pill px-4 py-2 fw-bold">XEM SẢN PHẨM</button>
            </div>`;
        return;
    }

    let allProds = (typeof getAllProducts === 'function') ? getAllProducts() : (typeof productsDatabase !== 'undefined' ? productsDatabase : []);
    let htmlContent = "";

    for (let i = 0; i < favIds.length; i++) {
        let p = allProds.find(item => item.id === favIds[i]);
        if (p) {
            let priceFormat = p.price.toLocaleString('vi-VN') + '₫';

            htmlContent += `
                <div class="cart-item" style="cursor:pointer; transition: background-color 0.2s;" onmouseover="this.style.backgroundColor='#f9f9f9'" onmouseout="this.style.backgroundColor='transparent'" onclick="window.location.href='productDetail.html?id=${p.id}'">
                    <img src="${p.img}" class="cart-item-img" alt="Giày" style="flex-shrink:0;">
                    <div style="flex:1; min-width:0;">
                        <div style="font-weight:700; font-size:20px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; color:#111;">
                            ${p.name}
                        </div>
                        <div style="color:#888; font-size:16px; margin:4px 0;">${p.category} · ${p.gender}</div>
                        <div style="color:#dc3545; font-weight:700; font-size:16px;">${priceFormat}</div>
                    </div>
                    <button onclick="event.stopPropagation(); removeFavorite(${p.id})" class="cart-remove-btn" title="Xóa khỏi yêu thích">✕</button>
                </div>`;
        }
    }
    container.innerHTML = htmlContent;
}

//showfavtoast: hiện thông báo thao tác yêu thích bằng SweetAlert2
function showFavToast(msg, color) {
    Swal.fire({
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: color === '#e74c3c' ? 'success' : 'info',
        title: msg
    });
}

//initfavourite: khởi tạo hệ thống yêu thích
function initFavourite() {
    injectFavHTML();
}
initFavourite();

//handlefavlinkclick: xử lý click vào link yêu thích
function handleFavLinkClick(e) {
    e.preventDefault();
    openFavPanel();
}