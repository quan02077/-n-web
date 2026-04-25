// ============================================================
// HỆ THỐNG YÊU THÍCH (BẢN TÁCH RỜI CSS)
// ============================================================

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

function openFavPanel() {
    renderFavPanel();
    document.getElementById('favPanel').classList.add('open');
    document.getElementById('favOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeFavPanel() {
    document.getElementById('favPanel').classList.remove('open');
    document.getElementById('favOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

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

function removeFavorite(productId) {
    let favs = JSON.parse(localStorage.getItem('basau_fav')) || [];
    let index = favs.indexOf(productId);
    if (index !== -1) {
        favs.splice(index, 1);
        localStorage.setItem('basau_fav', JSON.stringify(favs));
        renderFavPanel();
    }
}

function renderFavPanel() {
    let favIds = JSON.parse(localStorage.getItem('basau_fav')) || [];
    let container = document.getElementById('favItemsContainer');
    let countEl = document.getElementById('favHeaderCount');
    if (!container) return;

    if (countEl) countEl.innerText = favIds.length + ' sản phẩm';

    if (favIds.length === 0) {
        container.innerHTML = `
            <div class="fav-empty">
                <div style="font-size:64px; margin-bottom:18px; filter:grayscale(1);">🤍</div>
                <h5 style="color:#888; margin-bottom:8px;">Chưa có sản phẩm nào</h5>
                <p style="font-size:14px;">Hãy thả tim những đôi giày bạn thích nhé!</p>
                <button onclick="closeFavPanel()" class="btn btn-dark rounded-pill mt-3 px-4 py-2 fw-bold">XEM SẢN PHẨM</button>
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
                <div class="fav-item">
                    <a href="productDetail.html?id=${p.id}" class="fav-item-img">
                        <img src="${p.img}" alt="Giày">
                    </a>
                    <div class="fav-item-info">
                        <a href="productDetail.html?id=${p.id}" class="fav-item-name">${p.name}</a>
                        <div class="fav-item-sub">${p.category} · ${p.gender}</div>
                        <div class="fav-item-price">${priceFormat}</div>
                    </div>
                    <button onclick="removeFavorite(${p.id})" class="fav-remove-btn" title="Xóa">✕</button>
                </div>`;
        }
    }
    container.innerHTML = htmlContent;
}

function showFavToast(msg, color) {
    let toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.style.background = color;
    toast.innerHTML = `<strong>${msg}</strong>`;

    document.body.appendChild(toast);
    setTimeout(() => { toast.classList.add('show'); }, 30);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 350);
    }, 2400);
}

document.addEventListener('DOMContentLoaded', function () {
    injectFavHTML();
    let links = document.querySelectorAll('.tienich a');
    links.forEach(link => {
        if (link.innerText.includes('Yêu thích')) {
            link.href = '#';
            link.onclick = function (e) {
                e.preventDefault();
                openFavPanel();
            };
        }
    });
});