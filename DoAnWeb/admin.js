// ============================================================
//  ADMIN.JS – Quản lý sản phẩm Basau Sneakers (Nâng cấp v2)
//  Tính năng: Thêm / Điều chỉnh / Xóa sản phẩm
//             + Chọn màu sắc & kích cỡ
// ============================================================

// ──────────────────────────────────────────────────────────
//  DATA LAYER
// ──────────────────────────────────────────────────────────

function getAllProducts() {
    let base = (typeof productsDatabase !== 'undefined')
        ? productsDatabase.map(function(p) { return Object.assign({}, p); })
        : [];

    let added   = JSON.parse(localStorage.getItem('basau_addedProducts')  || '[]');
    let edited  = JSON.parse(localStorage.getItem('basau_editedProducts') || '{}');
    let deleted = JSON.parse(localStorage.getItem('basau_deletedIds')     || '[]');

    base = base.map(function(p) {
        return edited[p.id] ? Object.assign({}, p, edited[p.id]) : p;
    });
    base = base.filter(function(p) { return deleted.indexOf(p.id) === -1; });
    added = added
        .filter(function(p) { return deleted.indexOf(p.id) === -1; })
        .map(function(p)    { return edited[p.id] ? Object.assign({}, p, edited[p.id]) : p; });

    return base.concat(added);
}

function patchProductsDatabase() {
    if (typeof productsDatabase === 'undefined') return;
    var patched = getAllProducts();
    productsDatabase.length = 0;
    patched.forEach(function(p) { productsDatabase.push(p); });
}

function isStaff() {
    var user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    return user && user.role === 'Nhân viên';
}

// ──────────────────────────────────────────────────────────
//  STATE: Màu sắc & Kích cỡ tạm thời khi thêm/sửa
// ──────────────────────────────────────────────────────────

var _addColors  = [];   // [{hex, name}]
var _addSizes   = [];   // ['EU 36', 'EU 37', ...]
var _editColors = [];
var _editSizes  = [];
var currentEditId = null;

var ALL_SIZES = [
    'EU 35','EU 35.5','EU 36','EU 36.5','EU 37','EU 37.5',
    'EU 38','EU 38.5','EU 39','EU 39.5','EU 40','EU 40.5',
    'EU 41','EU 41.5','EU 42','EU 42.5','EU 43','EU 44',
    'EU 44.5','EU 45','EU 46','EU 47'
];

// ──────────────────────────────────────────────────────────
//  INJECT STYLES
// ──────────────────────────────────────────────────────────

function injectAdminStyles() {
    if (document.getElementById('adm-styles')) return;
    var style = document.createElement('style');
    style.id = 'adm-styles';
    style.textContent = `
      /* === RESET & BASE === */
      #adminModal * { box-sizing: border-box; }

      /* === OVERLAY === */
      #adminModal {
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,.72);
        backdrop-filter: blur(4px);
        z-index: 10000; overflow-y: auto; padding: 24px 16px;
        display: none;
      }

      /* === MODAL CARD === */
      .adm-card {
        background: #fff;
        max-width: 900px;
        margin: 0 auto;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 40px 100px rgba(0,0,0,.45);
        animation: admSlideUp .35s cubic-bezier(.22,.68,0,1.2);
      }
      @keyframes admSlideUp {
        from { opacity:0; transform:translateY(32px) scale(.97); }
        to   { opacity:1; transform:translateY(0)   scale(1);    }
      }

      /* === HEADER === */
      .adm-header {
        background: linear-gradient(135deg,#111 0%,#2d2d2d 100%);
        color: #fff;
        padding: 24px 32px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;
      }
      .adm-header::before {
        content:'';
        position:absolute; top:-60px; right:-40px;
        width:180px; height:180px;
        border-radius:50%;
        background:rgba(255,255,255,.04);
      }
      .adm-header-title {
        font-family:'Oswald',sans-serif;
        font-size:24px; letter-spacing:3px;
        margin:0; font-weight:700;
      }
      .adm-header-sub {
        font-size:12px; color:#999;
        margin:5px 0 0; letter-spacing:.5px;
      }
      .adm-close-btn {
        background: rgba(255,255,255,.1);
        border: 1.5px solid rgba(255,255,255,.18);
        color: #fff;
        width: 40px; height: 40px;
        border-radius: 50%;
        font-size: 18px; cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: .2s; flex-shrink: 0;
        position: relative; z-index: 1;
      }
      .adm-close-btn:hover { background: rgba(255,255,255,.22); transform: rotate(90deg); }

      /* === TABS === */
      .adm-tabs {
        display: flex;
        background: #f8f8f8;
        border-bottom: 2px solid #eee;
      }
      .adm-tab {
        flex: 1; padding: 18px 10px;
        border: none; font-weight: 700; font-size: 13px;
        cursor: pointer;
        font-family: 'Josefin Sans', sans-serif;
        letter-spacing: 1px;
        transition: .25s;
        border-bottom: 3px solid transparent;
        background: transparent;
        color: #aaa;
        display: flex; align-items: center; justify-content: center; gap: 7px;
      }
      .adm-tab .tab-icon { font-size: 16px; }
      .adm-tab.active {
        color: #111;
        border-bottom-color: #111;
        background: #fff;
      }
      .adm-tab:not(.active):hover { color: #555; background: #f0f0f0; }

      /* === PANELS === */
      .adm-panel { padding: 32px; display: none; }
      .adm-panel.active { display: block; }

      /* === SECTION TITLE === */
      .adm-section-title {
        font-family: 'Oswald', sans-serif;
        font-size: 16px; letter-spacing: 2px;
        color: #111; margin: 0 0 22px;
        display: flex; align-items: center; gap: 10px;
      }
      .adm-section-title::after {
        content: '';
        flex: 1; height: 1.5px;
        background: linear-gradient(90deg,#eee,transparent);
      }

      /* === GRID === */
      .adm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      @media(max-width:620px) { .adm-grid { grid-template-columns: 1fr; } }

      /* === FIELD GROUP === */
      .adm-field { display: flex; flex-direction: column; gap: 6px; }
      .adm-field.full { grid-column: 1 / -1; }
      .adm-label {
        font-weight: 700; font-size: 11px;
        letter-spacing: 1px; color: #555;
        text-transform: uppercase;
      }
      .adm-input {
        width: 100%; padding: 11px 14px;
        border: 1.5px solid #e8e8e8;
        border-radius: 10px;
        font-family: 'Josefin Sans', sans-serif;
        font-size: 14px;
        transition: .2s;
        background: #fafafa;
        color: #111;
      }
      .adm-input:focus { border-color: #111; outline: none; background: #fff; }
      .adm-input::placeholder { color: #bbb; }

      /* === BADGE SELECTOR === */
      .adm-badge-row { display: flex; flex-wrap: wrap; gap: 8px; }
      .adm-badge-opt {
        padding: 7px 14px;
        border: 1.5px solid #e0e0e0;
        border-radius: 50px;
        font-size: 12px; font-weight: 700;
        cursor: pointer;
        font-family: 'Josefin Sans', sans-serif;
        letter-spacing: .5px;
        transition: .18s;
        background: #fff;
        color: #777;
      }
      .adm-badge-opt.selected { background: #111; color: #fff; border-color: #111; }
      .adm-badge-opt[data-v="new"].selected    { background:#2196f3; border-color:#2196f3; }
      .adm-badge-opt[data-v="bestseller"].selected { background:#ff9800; border-color:#ff9800; }
      .adm-badge-opt[data-v="sale"].selected   { background:#dc3545; border-color:#dc3545; }
      .adm-badge-opt[data-v="limited"].selected { background:#9c27b0; border-color:#9c27b0; }

      /* === COLOR MANAGER === */
      .adm-color-row {
        display: flex; gap: 8px; align-items: center;
        flex-wrap: wrap;
      }
      .adm-color-input-wrap {
        display: flex; gap: 6px; align-items: center;
        flex: 1; min-width: 200px;
      }
      .adm-color-picker {
        width: 44px; height: 44px;
        border: 2px solid #e0e0e0;
        border-radius: 10px; cursor: pointer;
        padding: 2px; background: #fff;
      }
      .adm-color-name {
        flex: 1; padding: 11px 12px;
        border: 1.5px solid #e8e8e8; border-radius: 10px;
        font-family: 'Josefin Sans',sans-serif; font-size:13px;
        background: #fafafa; transition:.2s;
      }
      .adm-color-name:focus { border-color:#111; outline:none; background:#fff; }
      .adm-add-color-btn {
        padding: 10px 18px;
        background: #111; color: #fff;
        border: none; border-radius: 10px;
        font-weight: 700; font-size: 13px;
        cursor: pointer; transition: .2s;
        font-family: 'Josefin Sans',sans-serif;
        white-space: nowrap;
      }
      .adm-add-color-btn:hover { background: #333; }
      .adm-swatches { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
      .adm-swatch {
        display: flex; align-items: center; gap: 6px;
        padding: 5px 10px 5px 6px;
        border: 1.5px solid #e8e8e8;
        border-radius: 50px; background: #fff;
        font-size: 12px; font-weight: 600;
        font-family: 'Josefin Sans',sans-serif;
        cursor: default;
        animation: swatchIn .2s ease;
      }
      @keyframes swatchIn {
        from { opacity:0; transform:scale(.8); }
        to   { opacity:1; transform:scale(1); }
      }
      .adm-swatch-dot {
        width: 20px; height: 20px;
        border-radius: 50%;
        border: 1.5px solid rgba(0,0,0,.12);
        flex-shrink: 0;
      }
      .adm-swatch-del {
        margin-left: 4px; color: #bbb;
        cursor: pointer; font-size: 14px;
        transition: .15s; line-height: 1;
      }
      .adm-swatch-del:hover { color: #dc3545; }

      /* === SIZE GRID === */
      .adm-size-grid {
        display: flex; flex-wrap: wrap; gap: 8px;
      }
      .adm-size-chip {
        padding: 8px 12px;
        border: 1.5px solid #e0e0e0;
        border-radius: 8px;
        font-size: 12px; font-weight: 700;
        cursor: pointer;
        font-family: 'Josefin Sans',sans-serif;
        transition: .15s;
        background: #fff;
        color: #555;
        user-select: none;
      }
      .adm-size-chip:hover { border-color: #999; color: #111; }
      .adm-size-chip.on {
        background: #111; color: #fff;
        border-color: #111;
        box-shadow: 0 2px 8px rgba(0,0,0,.18);
      }
      .adm-size-quick {
        display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;
      }
      .adm-size-quick-btn {
        padding: 5px 12px;
        border: 1.5px solid #ddd; border-radius: 50px;
        font-size: 11px; font-weight: 700; letter-spacing: .5px;
        cursor: pointer; background: #fff; color: #888;
        font-family: 'Josefin Sans',sans-serif;
        transition: .15s;
      }
      .adm-size-quick-btn:hover { border-color: #111; color: #111; }

      /* === SUBMIT BUTTON === */
      .adm-submit-btn {
        width: 100%; padding: 15px;
        background: #111; color: #fff;
        border: none; border-radius: 50px;
        font-family: 'Josefin Sans',sans-serif;
        font-size: 14px; font-weight: 700;
        letter-spacing: 1px;
        cursor: pointer; transition: .25s;
        margin-top: 24px;
        position: relative; overflow: hidden;
      }
      .adm-submit-btn::before {
        content: '';
        position: absolute; top:0; left:-100%; width:100%; height:100%;
        background: linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent);
        transition: .5s;
      }
      .adm-submit-btn:hover { background: #333; }
      .adm-submit-btn:hover::before { left:100%; }

      /* === PRODUCT LIST === */
      .adm-search-wrap {
        position: relative; margin-bottom: 14px;
      }
      .adm-search-wrap input {
        width: 100%; padding: 11px 14px 11px 40px;
        border: 1.5px solid #e8e8e8; border-radius: 10px;
        font-family: 'Josefin Sans',sans-serif; font-size: 14px;
        background: #fafafa; transition: .2s;
      }
      .adm-search-wrap input:focus { border-color:#111; outline:none; background:#fff; }
      .adm-search-wrap::before {
        content: '🔍';
        position: absolute; left: 12px; top: 50%;
        transform: translateY(-50%);
        font-size: 14px; pointer-events: none;
      }
      .adm-scroll-list {
        max-height: 340px; overflow-y: auto;
        padding-right: 4px;
      }
      .adm-scroll-list::-webkit-scrollbar { width: 4px; }
      .adm-scroll-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

      .adm-product-row {
        display: flex; align-items: center; gap: 14px;
        padding: 14px; border: 1.5px solid #f0f0f0;
        border-radius: 12px; margin-bottom: 8px;
        cursor: pointer; transition: .2s;
        background: #fff;
      }
      .adm-product-row:hover { border-color: #111; background: #fafafa; transform: translateX(3px); }
      .adm-product-row.selected { border-color: #111; background: #f5f5f5; }
      .adm-product-img {
        width: 64px; height: 64px;
        object-fit: contain; background: #f5f5f5;
        border-radius: 10px; flex-shrink: 0;
      }
      .adm-row-name {
        font-weight: 700; font-size: 14px;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .adm-row-sub {
        color: #999; font-size: 12px; margin-top: 3px;
      }
      .adm-row-price {
        color: #dc3545; font-weight: 700; margin-top: 4px; font-size: 13px;
      }
      .adm-del-btn {
        background: #fff2f2; color: #dc3545;
        border: 1.5px solid #ffd0d0;
        padding: 8px 14px; border-radius: 50px;
        font-size: 12px; font-weight: 700;
        cursor: pointer; transition: .2s;
        flex-shrink: 0;
        font-family: 'Josefin Sans',sans-serif;
        white-space: nowrap;
      }
      .adm-del-btn:hover { background: #dc3545; color: #fff; border-color: #dc3545; }
      .adm-del-btn:disabled { background: #f5f5f5; color: #bbb; border-color: #eee; cursor:default; }

      /* === EDIT FORM DIVIDER === */
      .adm-edit-divider {
        margin: 28px 0 24px;
        border: none; border-top: 2px solid #f0f0f0;
        position: relative;
      }
      .adm-edit-divider::after {
        content: 'CHỈNH SỬA SẢN PHẨM';
        position: absolute; top: -10px; left: 50%;
        transform: translateX(-50%);
        background: #fff; padding: 0 12px;
        font-size: 10px; font-weight: 700; letter-spacing: 2px; color: #bbb;
        font-family: 'Josefin Sans',sans-serif;
      }

      /* === TOAST === */
      .adm-toast {
        position: fixed; bottom: 28px; left: 50%;
        transform: translateX(-50%) translateY(20px);
        padding: 14px 28px; border-radius: 50px;
        font-family: 'Josefin Sans',sans-serif;
        font-size: 14px; font-weight: 600;
        z-index: 99999;
        box-shadow: 0 10px 40px rgba(0,0,0,.3);
        opacity: 0; transition: all .3s ease;
        white-space: nowrap;
        display: flex; align-items: center; gap: 8px;
      }
      .adm-toast.show {
        opacity: 1; transform: translateX(-50%) translateY(0);
      }

      /* === EMPTY STATE === */
      .adm-empty {
        text-align: center; padding: 40px 20px; color: #bbb;
      }
      .adm-empty-icon { font-size: 48px; margin-bottom: 12px; }
      .adm-empty p { font-size: 14px; margin: 0; }
    `;
    document.head.appendChild(style);
}

// ──────────────────────────────────────────────────────────
//  INJECT MODAL HTML
// ──────────────────────────────────────────────────────────

function injectAdminModal() {
    injectAdminStyles();
    if (document.getElementById('adminModal')) return;

    var html = `
<div id="adminModal">
  <div class="adm-card">

    <!-- Header -->
    <div class="adm-header">
      <div>
        <h4 class="adm-header-title">⚙ QUẢN LÝ SẢN PHẨM</h4>
        <p class="adm-header-sub" id="adminUserLabel">Đang tải...</p>
      </div>
      <button class="adm-close-btn" onclick="closeAdminModal()">✕</button>
    </div>

    <!-- Tabs -->
    <div class="adm-tabs">
      <button class="adm-tab active" id="adm-tab-add"    onclick="switchAdminTab('add')">
        <span class="tab-icon">＋</span> Thêm mới
      </button>
      <button class="adm-tab"        id="adm-tab-edit"   onclick="switchAdminTab('edit')">
        <span class="tab-icon">✎</span> Điều chỉnh
      </button>
      <button class="adm-tab"        id="adm-tab-delete" onclick="switchAdminTab('delete')">
        <span class="tab-icon">🗑</span> Xóa sản phẩm
      </button>
    </div>

    <!-- ══════════════════ PANEL: ADD ══════════════════ -->
    <div class="adm-panel active" id="adm-panel-add">

      <p class="adm-section-title">THÔNG TIN CƠ BẢN</p>
      <div class="adm-grid">
        <div class="adm-field">
          <label class="adm-label">Tên sản phẩm *</label>
          <input id="add_name" class="adm-input" type="text" placeholder="Vd: Nike Air Max 90">
        </div>
        <div class="adm-field">
          <label class="adm-label">Thương hiệu *</label>
          <select id="add_brand" class="adm-input">
            <option>Nike</option><option>Adidas</option><option>New Balance</option>
            <option>Onitsuka Tiger</option><option>Puma</option><option>Birkenstock</option><option>Converse</option>
          </select>
        </div>
        <div class="adm-field">
          <label class="adm-label">Loại giày *</label>
          <select id="add_category" class="adm-input">
            <option value="Sneakers">Sneakers</option>
            <option value="Running">Giày chạy bộ</option>
            <option value="Classic">Giày cổ điển</option>
            <option value="Dép">Dép</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>
        </div>
        <div class="adm-field">
          <label class="adm-label">Giới tính *</label>
          <select id="add_gender" class="adm-input">
            <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Unisex">Unisex</option>
          </select>
        </div>
        <div class="adm-field">
          <label class="adm-label">Giá bán (₫) *</label>
          <input id="add_price" class="adm-input" type="number" placeholder="Vd: 2500000">
        </div>
        <div class="adm-field">
          <label class="adm-label">Giá cũ (₫) – để trống nếu không</label>
          <input id="add_oldPrice" class="adm-input" type="number" placeholder="0">
        </div>
        <div class="adm-field full">
          <label class="adm-label">Đường dẫn ảnh *</label>
          <input id="add_img" class="adm-input" type="text" placeholder="hinhAnh/giayNam/anh.png">
        </div>
      </div>

      <!-- Badge -->
      <p class="adm-section-title" style="margin-top:24px;">NHÃN SẢN PHẨM</p>
      <input type="hidden" id="add_badge" value="">
      <div class="adm-badge-row" id="addBadgeRow">
        <button type="button" class="adm-badge-opt selected" data-v=""       onclick="selectBadge('add',this)">Không có</button>
        <button type="button" class="adm-badge-opt"          data-v="new"    onclick="selectBadge('add',this)">✨ New</button>
        <button type="button" class="adm-badge-opt"          data-v="bestseller" onclick="selectBadge('add',this)">🔥 Best Seller</button>
        <button type="button" class="adm-badge-opt"          data-v="sale"   onclick="selectBadge('add',this)">🏷 Sale</button>
        <button type="button" class="adm-badge-opt"          data-v="limited" onclick="selectBadge('add',this)">💎 Limited</button>
      </div>

      <!-- Colors -->
      <p class="adm-section-title" style="margin-top:24px;">MÀU SẮC</p>
      <div class="adm-color-row">
        <div class="adm-color-input-wrap">
          <input type="color" id="add_colorPicker" class="adm-color-picker" value="#000000">
          <input type="text"  id="add_colorName"   class="adm-color-name adm-input" placeholder="Tên màu (Vd: Đen, Trắng...)">
        </div>
        <button type="button" class="adm-add-color-btn" onclick="addColorTo('add')">+ Thêm màu</button>
      </div>
      <div class="adm-swatches" id="addSwatches"></div>

      <!-- Sizes -->
      <p class="adm-section-title" style="margin-top:24px;">KÍCH CỠ (SIZE)</p>
      <div class="adm-size-quick">
        <button type="button" class="adm-size-quick-btn" onclick="quickSize('add','all')">Chọn tất cả</button>
        <button type="button" class="adm-size-quick-btn" onclick="quickSize('add','men')">Nam (39–46)</button>
        <button type="button" class="adm-size-quick-btn" onclick="quickSize('add','women')">Nữ (35–40)</button>
        <button type="button" class="adm-size-quick-btn" onclick="quickSize('add','clear')">Xóa hết</button>
      </div>
      <div class="adm-size-grid" id="addSizeGrid"></div>

      <button class="adm-submit-btn" onclick="submitAddProduct()">＋ THÊM SẢN PHẨM</button>
    </div>

    <!-- ══════════════════ PANEL: EDIT ══════════════════ -->
    <div class="adm-panel" id="adm-panel-edit">
      <p class="adm-section-title">CHỌN SẢN PHẨM</p>
      <div class="adm-search-wrap">
        <input id="editSearch" type="text" placeholder="Tìm kiếm sản phẩm..." oninput="filterAdminList('edit')">
      </div>
      <div class="adm-scroll-list" id="editList"></div>

      <!-- Edit Form (hidden until product selected) -->
      <div id="editFormWrap" style="display:none;">
        <hr class="adm-edit-divider">

        <div class="adm-grid">
          <div class="adm-field">
            <label class="adm-label">Tên sản phẩm *</label>
            <input id="edit_name" class="adm-input" type="text">
          </div>
          <div class="adm-field">
            <label class="adm-label">Thương hiệu *</label>
            <select id="edit_brand" class="adm-input">
              <option>Nike</option><option>Adidas</option><option>New Balance</option>
              <option>Onitsuka Tiger</option><option>Puma</option><option>Birkenstock</option><option>Converse</option>
            </select>
          </div>
          <div class="adm-field">
            <label class="adm-label">Loại giày *</label>
            <select id="edit_category" class="adm-input">
              <option value="Sneakers">Sneakers</option>
              <option value="Running">Giày chạy bộ</option>
              <option value="Classic">Giày cổ điển</option>
              <option value="Dép">Dép</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>
          </div>
          <div class="adm-field">
            <label class="adm-label">Giới tính *</label>
            <select id="edit_gender" class="adm-input">
              <option value="Nam">Nam</option><option value="Nữ">Nữ</option><option value="Unisex">Unisex</option>
            </select>
          </div>
          <div class="adm-field">
            <label class="adm-label">Giá bán (₫) *</label>
            <input id="edit_price" class="adm-input" type="number">
          </div>
          <div class="adm-field">
            <label class="adm-label">Giá cũ (₫)</label>
            <input id="edit_oldPrice" class="adm-input" type="number">
          </div>
          <div class="adm-field full">
            <label class="adm-label">Đường dẫn ảnh *</label>
            <input id="edit_img" class="adm-input" type="text">
          </div>
        </div>

        <p class="adm-section-title" style="margin-top:24px;">NHÃN SẢN PHẨM</p>
        <input type="hidden" id="edit_badge" value="">
        <div class="adm-badge-row" id="editBadgeRow">
          <button type="button" class="adm-badge-opt selected" data-v=""    onclick="selectBadge('edit',this)">Không có</button>
          <button type="button" class="adm-badge-opt" data-v="new"          onclick="selectBadge('edit',this)">✨ New</button>
          <button type="button" class="adm-badge-opt" data-v="bestseller"   onclick="selectBadge('edit',this)">🔥 Best Seller</button>
          <button type="button" class="adm-badge-opt" data-v="sale"         onclick="selectBadge('edit',this)">🏷 Sale</button>
          <button type="button" class="adm-badge-opt" data-v="limited"      onclick="selectBadge('edit',this)">💎 Limited</button>
        </div>

        <p class="adm-section-title" style="margin-top:24px;">MÀU SẮC</p>
        <div class="adm-color-row">
          <div class="adm-color-input-wrap">
            <input type="color" id="edit_colorPicker" class="adm-color-picker" value="#000000">
            <input type="text"  id="edit_colorName"   class="adm-color-name adm-input" placeholder="Tên màu...">
          </div>
          <button type="button" class="adm-add-color-btn" onclick="addColorTo('edit')">+ Thêm màu</button>
        </div>
        <div class="adm-swatches" id="editSwatches"></div>

        <p class="adm-section-title" style="margin-top:24px;">KÍCH CỠ (SIZE)</p>
        <div class="adm-size-quick">
          <button type="button" class="adm-size-quick-btn" onclick="quickSize('edit','all')">Chọn tất cả</button>
          <button type="button" class="adm-size-quick-btn" onclick="quickSize('edit','men')">Nam (39–46)</button>
          <button type="button" class="adm-size-quick-btn" onclick="quickSize('edit','women')">Nữ (35–40)</button>
          <button type="button" class="adm-size-quick-btn" onclick="quickSize('edit','clear')">Xóa hết</button>
        </div>
        <div class="adm-size-grid" id="editSizeGrid"></div>

        <button class="adm-submit-btn" style="background:#111;" onclick="submitEditProduct()">💾 LƯU THAY ĐỔI</button>
      </div>
    </div>

    <!-- ══════════════════ PANEL: DELETE ══════════════════ -->
    <div class="adm-panel" id="adm-panel-delete">
      <p class="adm-section-title">CHỌN SẢN PHẨM ĐỂ XÓA</p>
      <div class="adm-search-wrap">
        <input id="deleteSearch" type="text" placeholder="Tìm kiếm sản phẩm..." oninput="filterAdminList('delete')">
      </div>
      <div class="adm-scroll-list" id="deleteList"></div>
    </div>

  </div><!-- /.adm-card -->
</div><!-- /#adminModal -->`;

    document.body.insertAdjacentHTML('beforeend', html);

    // Close on backdrop click
    document.getElementById('adminModal').addEventListener('click', function(e) {
        if (e.target === this) closeAdminModal();
    });

    // Build size grids
    buildSizeGrid('add');
    buildSizeGrid('edit');
}

// ──────────────────────────────────────────────────────────
//  SIZE GRID
// ──────────────────────────────────────────────────────────

function buildSizeGrid(mode) {
    var grid = document.getElementById(mode + 'SizeGrid');
    if (!grid) return;
    grid.innerHTML = ALL_SIZES.map(function(s) {
        return '<button type="button" class="adm-size-chip" data-size="' + s + '" onclick="toggleSize(\'' + mode + '\',this)">' + s + '</button>';
    }).join('');
}

function toggleSize(mode, btn) {
    var arr = (mode === 'add') ? _addSizes : _editSizes;
    var sz  = btn.getAttribute('data-size');
    var idx = arr.indexOf(sz);
    if (idx === -1) {
        arr.push(sz);
        btn.classList.add('on');
    } else {
        arr.splice(idx, 1);
        btn.classList.remove('on');
    }
}

function quickSize(mode, preset) {
    var arr      = (mode === 'add') ? _addSizes : _editSizes;
    var grid     = document.getElementById(mode + 'SizeGrid');
    var men      = ['EU 39','EU 39.5','EU 40','EU 40.5','EU 41','EU 41.5','EU 42','EU 42.5','EU 43','EU 44','EU 44.5','EU 45','EU 46'];
    var women    = ['EU 35','EU 35.5','EU 36','EU 36.5','EU 37','EU 37.5','EU 38','EU 38.5','EU 39','EU 39.5','EU 40'];
    var target   = (preset === 'all') ? ALL_SIZES : (preset === 'men') ? men : (preset === 'women') ? women : [];

    arr.length = 0;
    if (preset !== 'clear') target.forEach(function(s) { arr.push(s); });

    grid.querySelectorAll('.adm-size-chip').forEach(function(btn) {
        var on = arr.indexOf(btn.getAttribute('data-size')) !== -1;
        btn.classList.toggle('on', on);
    });
}

function setSizeGrid(mode, sizes) {
    var arr  = (mode === 'add') ? _addSizes : _editSizes;
    var grid = document.getElementById(mode + 'SizeGrid');
    arr.length = 0;
    sizes.forEach(function(s) { arr.push(s); });
    if (!grid) return;
    grid.querySelectorAll('.adm-size-chip').forEach(function(btn) {
        btn.classList.toggle('on', arr.indexOf(btn.getAttribute('data-size')) !== -1);
    });
}

// ──────────────────────────────────────────────────────────
//  COLOR MANAGER
// ──────────────────────────────────────────────────────────

function addColorTo(mode) {
    var picker = document.getElementById(mode + '_colorPicker');
    var nameEl = document.getElementById(mode + '_colorName');
    var arr    = (mode === 'add') ? _addColors : _editColors;
    var hex    = picker.value;
    var name   = (nameEl.value || '').trim() || hex;

    arr.push({ hex: hex, name: name });
    nameEl.value = '';
    renderSwatches(mode);
}

function removeColor(mode, idx) {
    var arr = (mode === 'add') ? _addColors : _editColors;
    arr.splice(idx, 1);
    renderSwatches(mode);
}

function renderSwatches(mode) {
    var arr       = (mode === 'add') ? _addColors : _editColors;
    var container = document.getElementById(mode + 'Swatches');
    if (!container) return;

    if (arr.length === 0) {
        container.innerHTML = '<span style="font-size:12px;color:#bbb;font-family:Josefin Sans,sans-serif;">Chưa có màu nào được thêm</span>';
        return;
    }

    container.innerHTML = arr.map(function(c, i) {
        return '<div class="adm-swatch">' +
            '<div class="adm-swatch-dot" style="background:' + c.hex + '"></div>' +
            '<span style="font-size:12px;font-family:Josefin Sans,sans-serif;">' + escapeHtml(c.name) + '</span>' +
            '<span class="adm-swatch-del" onclick="removeColor(\'' + mode + '\',' + i + ')">✕</span>' +
            '</div>';
    }).join('');
}

function setColors(mode, colors) {
    var arr = (mode === 'add') ? _addColors : _editColors;
    arr.length = 0;

    // colors có thể là mảng string (đường dẫn ảnh cũ) hoặc {hex, name}
    colors.forEach(function(c) {
        if (typeof c === 'string') {
            arr.push({ hex: '#cccccc', name: c });
        } else {
            arr.push(c);
        }
    });
    renderSwatches(mode);
}

// ──────────────────────────────────────────────────────────
//  BADGE SELECTOR
// ──────────────────────────────────────────────────────────

function selectBadge(mode, btn) {
    var row = document.getElementById(mode + 'BadgeRow');
    row.querySelectorAll('.adm-badge-opt').forEach(function(b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    document.getElementById(mode + '_badge').value = btn.getAttribute('data-v');
}

function setBadge(mode, val) {
    var row = document.getElementById(mode + 'BadgeRow');
    if (!row) return;
    row.querySelectorAll('.adm-badge-opt').forEach(function(b) {
        b.classList.toggle('selected', b.getAttribute('data-v') === (val || ''));
    });
    document.getElementById(mode + '_badge').value = val || '';
}

// ──────────────────────────────────────────────────────────
//  MỞ / ĐÓNG / CHUYỂN TAB
// ──────────────────────────────────────────────────────────

function openAdminPanel(tab) {
    if (!isStaff()) {
        if (confirm('Tính năng này yêu cầu đăng nhập với tài khoản Nhân viên.\nBạn có muốn đến trang đăng nhập không?')) {
            window.location.href = 'login.html';
        }
        return;
    }
    injectAdminModal();

    var user = JSON.parse(localStorage.getItem('currentUser') || 'null');
    document.getElementById('adminUserLabel').textContent =
        '👤 ' + (user ? user.username : '') + '  ·  ' + (user ? user.role : '');

    document.getElementById('adminModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    switchAdminTab(tab || 'add');
}

function closeAdminModal() {
    var m = document.getElementById('adminModal');
    if (m) m.style.display = 'none';
    document.body.style.overflow = '';
}

function switchAdminTab(tab) {
    ['add', 'edit', 'delete'].forEach(function(t) {
        var panel = document.getElementById('adm-panel-' + t);
        var btn   = document.getElementById('adm-tab-' + t);
        if (panel) panel.classList.toggle('active', t === tab);
        if (btn)   btn.classList.toggle('active',  t === tab);
    });
    if (tab === 'edit')   loadEditList();
    if (tab === 'delete') loadDeleteList();
}

// ──────────────────────────────────────────────────────────
//  THÊM SẢN PHẨM
// ──────────────────────────────────────────────────────────

function submitAddProduct() {
    var name     = (document.getElementById('add_name').value || '').trim();
    var price    = parseInt(document.getElementById('add_price').value)    || 0;
    var oldPrice = parseInt(document.getElementById('add_oldPrice').value) || 0;
    var img      = (document.getElementById('add_img').value || '').trim();

    if (!name || !price || !img) {
        showAdminToast('⚠ Vui lòng điền đầy đủ các trường bắt buộc (*)', '#e74c3c');
        return;
    }

    var allIds = getAllProducts().map(function(p) { return p.id; });
    var maxId  = allIds.length ? Math.max.apply(null, allIds) : 100;
    var added  = JSON.parse(localStorage.getItem('basau_addedProducts') || '[]');

    var newProduct = {
        id:         maxId + 1,
        brand:      document.getElementById('add_brand').value,
        name:       name,
        category:   document.getElementById('add_category').value,
        gender:     document.getElementById('add_gender').value,
        price:      price,
        oldPrice:   oldPrice,
        badge:      document.getElementById('add_badge').value,
        img:        img,
        thumbnails: [img],
        colors:     _addColors.slice(),
        sizes:      _addSizes.slice()
    };

    added.push(newProduct);
    localStorage.setItem('basau_addedProducts', JSON.stringify(added));

    // Reset state
    _addColors.length = 0;
    _addSizes.length  = 0;

    closeAdminModal();
    showAdminToast('✅ Đã thêm "' + name + '" thành công!', '#27ae60');
    setTimeout(function() { location.reload(); }, 1400);
}

// ──────────────────────────────────────────────────────────
//  ĐIỀU CHỈNH SẢN PHẨM
// ──────────────────────────────────────────────────────────

function loadEditList() {
    renderProductList('editList', getAllProducts(), 'edit');
    document.getElementById('editFormWrap').style.display = 'none';
    currentEditId = null;
}

function selectProductToEdit(id) {
    var products = getAllProducts();
    var p = null;
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) { p = products[i]; break; }
    }
    if (!p) return;

    currentEditId = id;

    document.querySelectorAll('#editList .adm-product-row').forEach(function(el) {
        el.classList.toggle('selected', parseInt(el.dataset.id) === id);
    });

    document.getElementById('edit_name').value     = p.name;
    document.getElementById('edit_brand').value    = p.brand;
    document.getElementById('edit_category').value = p.category;
    document.getElementById('edit_gender').value   = p.gender;
    document.getElementById('edit_price').value    = p.price;
    document.getElementById('edit_oldPrice').value = p.oldPrice || 0;
    document.getElementById('edit_img').value      = p.img;

    setBadge('edit', p.badge || '');
    setColors('edit', p.colors || []);
    setSizeGrid('edit', p.sizes || []);

    var wrap = document.getElementById('editFormWrap');
    wrap.style.display = 'block';
    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function submitEditProduct() {
    if (!currentEditId) return;
    var name  = (document.getElementById('edit_name').value || '').trim();
    var price = parseInt(document.getElementById('edit_price').value) || 0;
    var img   = (document.getElementById('edit_img').value  || '').trim();

    if (!name || !price || !img) {
        showAdminToast('⚠ Vui lòng điền đầy đủ các trường bắt buộc!', '#e74c3c');
        return;
    }

    var edited = JSON.parse(localStorage.getItem('basau_editedProducts') || '{}');
    edited[currentEditId] = {
        name:       name,
        brand:      document.getElementById('edit_brand').value,
        category:   document.getElementById('edit_category').value,
        gender:     document.getElementById('edit_gender').value,
        price:      price,
        oldPrice:   parseInt(document.getElementById('edit_oldPrice').value) || 0,
        badge:      document.getElementById('edit_badge').value,
        img:        img,
        thumbnails: [img],
        colors:     _editColors.slice(),
        sizes:      _editSizes.slice()
    };

    localStorage.setItem('basau_editedProducts', JSON.stringify(edited));
    closeAdminModal();
    showAdminToast('✅ Đã cập nhật sản phẩm thành công!', '#27ae60');
    setTimeout(function() { location.reload(); }, 1400);
}

// ──────────────────────────────────────────────────────────
//  XÓA SẢN PHẨM
// ──────────────────────────────────────────────────────────

function loadDeleteList() {
    renderProductList('deleteList', getAllProducts(), 'delete');
}

function deleteProduct(id, btn) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;

    var deletedIds = JSON.parse(localStorage.getItem('basau_deletedIds') || '[]');
    if (deletedIds.indexOf(id) === -1) deletedIds.push(id);
    localStorage.setItem('basau_deletedIds', JSON.stringify(deletedIds));

    var added = JSON.parse(localStorage.getItem('basau_addedProducts') || '[]');
    added = added.filter(function(p) { return p.id !== id; });
    localStorage.setItem('basau_addedProducts', JSON.stringify(added));

    var row = btn.closest('.adm-product-row');
    row.style.opacity = '.35';
    row.style.pointerEvents = 'none';
    btn.textContent  = '✓ Đã xóa';
    btn.disabled     = true;

    patchProductsDatabase();
    showAdminToast('🗑 Đã xóa sản phẩm thành công!', '#e74c3c');
}

// ──────────────────────────────────────────────────────────
//  RENDER DANH SÁCH / FILTER
// ──────────────────────────────────────────────────────────

function renderProductList(containerId, products, mode) {
    var container = document.getElementById(containerId);
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = '<div class="adm-empty"><div class="adm-empty-icon">📦</div><p>Không có sản phẩm nào.</p></div>';
        return;
    }

    container.innerHTML = products.map(function(p) {
        var badge = p.badge ? '<span style="font-size:10px;padding:2px 8px;border-radius:50px;background:#f0f0f0;color:#888;font-weight:700;margin-left:6px;">' + p.badge.toUpperCase() + '</span>' : '';

        if (mode === 'delete') {
            return '<div class="adm-product-row" data-id="' + p.id + '" data-name="' + escapeAttr(p.name.toLowerCase()) + '">' +
                '<img src="' + p.img + '" class="adm-product-img" onerror="this.src=\'hinhAnh/logo.jpg\'">' +
                '<div style="flex:1;min-width:0;">' +
                '<div class="adm-row-name">' + escapeHtml(p.name) + badge + '</div>' +
                '<div class="adm-row-sub">' + p.brand + ' · ' + p.category + ' · ' + p.gender + '</div>' +
                '<div class="adm-row-price">' + p.price.toLocaleString('vi-VN') + '₫</div>' +
                '</div>' +
                '<button class="adm-del-btn" onclick="deleteProduct(' + p.id + ', this)">🗑 Xóa</button>' +
                '</div>';
        } else {
            return '<div class="adm-product-row" data-id="' + p.id + '" data-name="' + escapeAttr(p.name.toLowerCase()) + '" onclick="selectProductToEdit(' + p.id + ')">' +
                '<img src="' + p.img + '" class="adm-product-img" onerror="this.src=\'hinhAnh/logo.jpg\'">' +
                '<div style="flex:1;min-width:0;">' +
                '<div class="adm-row-name">' + escapeHtml(p.name) + badge + '</div>' +
                '<div class="adm-row-sub">' + p.brand + ' · ' + p.category + ' · ' + p.gender + '</div>' +
                '<div class="adm-row-price">' + p.price.toLocaleString('vi-VN') + '₫</div>' +
                '</div>' +
                '<span style="color:#ccc;font-size:20px;flex-shrink:0;">›</span>' +
                '</div>';
        }
    }).join('');
}

function filterAdminList(mode) {
    var searchId = mode === 'edit' ? 'editSearch' : 'deleteSearch';
    var listId   = mode === 'edit' ? 'editList'   : 'deleteList';
    var query    = (document.getElementById(searchId).value || '').toLowerCase();

    document.querySelectorAll('#' + listId + ' .adm-product-row').forEach(function(el) {
        el.style.display = (el.dataset.name || '').includes(query) ? '' : 'none';
    });
}

// ──────────────────────────────────────────────────────────
//  UTILS
// ──────────────────────────────────────────────────────────

function escapeHtml(str) {
    return String(str)
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;');
}
function escapeAttr(str) {
    return String(str).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function showAdminToast(msg, bg) {
    var t = document.createElement('div');
    t.className = 'adm-toast';
    t.style.background = bg || '#111';
    t.style.color = '#fff';
    t.innerHTML = msg;
    document.body.appendChild(t);
    setTimeout(function() { t.classList.add('show'); }, 30);
    setTimeout(function() {
        t.classList.remove('show');
        setTimeout(function() { t.remove(); }, 400);
    }, 2600);
}

// Backward-compat alias
function showToast(msg, bg) { showAdminToast(msg, bg); }

// ──────────────────────────────────────────────────────────
//  SETUP LINKS & INIT
// ──────────────────────────────────────────────────────────

function setupAdminLinks() {
    document.querySelectorAll('.tienich a').forEach(function(link) {
        var img = link.querySelector('img');
        if (!img) return;
        var src = img.getAttribute('src') || '';
        if (src.indexOf('addIcon') !== -1) {
            link.href = '#';
            link.onclick = function(e) { e.preventDefault(); openAdminPanel('add'); };
        } else if (src.indexOf('editIcon') !== -1) {
            link.href = '#';
            link.onclick = function(e) { e.preventDefault(); openAdminPanel('edit'); };
        } else if (src.indexOf('removeIcon') !== -1) {
            link.href = '#';
            link.onclick = function(e) { e.preventDefault(); openAdminPanel('delete'); };
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    patchProductsDatabase();
    setupAdminLinks();
});