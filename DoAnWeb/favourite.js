function injectFavHTML() {
    if (document.getElementById('favPanel')) return;

    let overlay = document.createElement('div');
    overlay.id = 'favOverlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);z-index:9998;opacity:0;visibility:hidden;transition:all 0.3s ease;';
    overlay.onclick = closeFavPanel;

    let panel = document.createElement('div');
    panel.id = 'favPanel';
    // Khung trượt từ bên phải sang, giống hệt Giỏ hàng
    panel.style.cssText = 'position:fixed;top:0;right:0;width:400px;max-width:100%;height:100%;background:#fff;z-index:9999;transform:translateX(100%);transition:transform 0.3s ease;display:flex;flex-direction:column;box-shadow:-5px 0 15px rgba(0,0,0,0.1);';

    panel.innerHTML = `
        <div style="background:#111; color:#fff; padding:20px 24px; display:flex; justify-content:space-between; align-items:center; flex-shrink:0;">
            <div>
                <h5 style="margin:0; font-family:'Oswald',sans-serif; font-size:20px; letter-spacing:2px;">🤍 YÊU THÍCH</h5>
                <p id="favHeaderCount" style="margin:3px 0 0; font-size:12px; color:#aaa;">0 sản phẩm</p>
            </div>
            <button onclick="closeFavPanel()" style="background:rgba(255,255,255,.12);border:none;color:#fff; width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer; display:flex;align-items:center;justify-content:center;">✕</button>
        </div>
        <div id="favItemsContainer" style="flex:1; overflow-y:auto; padding:20px;"></div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
}

// 2. MỞ / ĐÓNG NGĂN KÉO
function openFavPanel() {
    renderFavPanel();
    let panel = document.getElementById('favPanel');
    let overlay = document.getElementById('favOverlay');
    if (panel && overlay) {
        overlay.style.visibility = 'visible';
        overlay.style.opacity = '1';
        panel.style.transform = 'translateX(0)';
        document.body.style.overflow = 'hidden';
    }
}

function closeFavPanel() {
    let panel = document.getElementById('favPanel');
    let overlay = document.getElementById('favOverlay');
    if (panel && overlay) {
        overlay.style.opacity = '0';
        panel.style.transform = 'translateX(100%)';
        document.body.style.overflow = '';
        setTimeout(() => overlay.style.visibility = 'hidden', 300);
    }
}

// 3. THÊM / XÓA SẢN PHẨM KHỎI YÊU THÍCH (Dùng LocalStorage)
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

// 4. IN DANH SÁCH YÊU THÍCH RA MÀN HÌNH
function renderFavPanel() {
    let favIds = JSON.parse(localStorage.getItem('basau_fav')) || [];
    let container = document.getElementById('favItemsContainer');
    let countEl = document.getElementById('favHeaderCount');
    if (!container) return;

    if (countEl) countEl.innerText = favIds.length + ' sản phẩm';

    if (favIds.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:70px 20px; color:#bbb;"><div style="font-size:64px; margin-bottom:18px; filter:grayscale(1);">🤍</div><h5 style="color:#888; margin-bottom:8px;">Chưa có sản phẩm nào</h5><p style="font-size:14px;">Hãy thả tim những đôi giày bạn thích nhé!</p><button onclick="closeFavPanel()" style="background:#111;color:#fff;border:none;padding:12px 28px;border-radius:50px;font-weight:700;cursor:pointer;margin-top:12px;">XEM SẢN PHẨM</button></div>';
        return;
    }

    // Lấy kho dữ liệu tổng để dò tìm thông tin giày
    let allProds = (typeof getAllProducts === 'function') ? getAllProducts() : (typeof productsDatabase !== 'undefined' ? productsDatabase : []);

    let htmlContent = "";
    for (let i = 0; i < favIds.length; i++) {
        let p = allProds.find(item => item.id === favIds[i]);
        if (p) {
            let priceFormat = p.price.toLocaleString('vi-VN') + '₫';
            htmlContent += `
                <div style="display:flex; align-items:center; margin-bottom:20px; padding-bottom:20px; border-bottom:1px solid #eee;">
                    <a href="productDetail.html?id=${p.id}" style="display:block; width:80px; height:80px; background:#f8f9fa; border-radius:10px; overflow:hidden; flex-shrink:0;">
                        <img src="${p.img}" style="width:100%; height:100%; object-fit:contain;" alt="Giày">
                    </a>
                    <div style="flex:1; padding-left:16px; min-width:0;">
                        <a href="productDetail.html?id=${p.id}" style="text-decoration:none; color:#111;">
                            <div style="font-weight:700; font-size:14px; margin-bottom:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${p.name}</div>
                        </a>
                        <div style="color:#888; font-size:12px; margin-bottom:6px;">${p.category} · ${p.gender}</div>
                        <div style="color:#dc3545; font-weight:700; font-size:15px;">${priceFormat}</div>
                    </div>
                    <button onclick="removeFavorite(${p.id})" style="background:none; border:none; color:#aaa; font-size:24px; cursor:pointer; padding:0 10px; line-height:1;" title="Xóa khỏi yêu thích">✕</button>
                </div>
            `;
        }
    }
    container.innerHTML = htmlContent;
}

function showFavToast(msg, color) {
    let toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:28px;right:28px;background:${color};color:#fff;padding:16px 24px;border-radius:14px;font-family:"Josefin Sans",sans-serif;font-size:14px;z-index:99999;box-shadow:0 10px 40px rgba(0,0,0,.35);opacity:0;transform:translateY(12px);transition:all .3s ease;max-width:320px;`;
    toast.innerHTML = `<strong>${msg}</strong>`;

    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '1'; toast.style.transform = 'translateY(0)'; }, 30);
    setTimeout(() => {
        toast.style.opacity = '0'; toast.style.transform = 'translateY(12px)';
        setTimeout(() => toast.remove(), 350);
    }, 2400);
}

// 5. KHỞI ĐỘNG CÙNG TRANG WEB
document.addEventListener('DOMContentLoaded', function () {
    injectFavHTML();

    // Đi tìm cái nút "♡ Yêu thích" trên Header để gắn sự kiện bấm vào
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