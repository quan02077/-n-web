const headerHTML = `
        <div class="rowHeader bg-light py-1 border-bottom">
            <div class="container-fluid px-4 d-flex justify-content-end align-items-center gap-4">
                <div class="tienich">
                    <a href="admin.html" class="text-secondary text-decoration-none" id="QL_btn"><img
                            src="hinhAnh/quanlyIcon.png" width="16" class="me-1 opacity-75">Quản lý sản phẩm</a>
                </div>
                <div class="tienich">
                    <a href="#" class="text-secondary text-decoration-none" onclick="handleCartLinkClick(event)"><img
                            src="hinhAnh/cartIcon.png" width="16" class="me-1 opacity-75">Giỏ hàng (0)</a>
                </div>
                <div class="tienich">
                    <a href="#" class="text-secondary text-decoration-none" onclick="handleFavLinkClick(event)">♡ Yêu
                        thích</a>
                </div>
                <div class="tienich">
                    <a href="login.html" class="text-secondary text-decoration-none" id="userAccountLink"
                        onclick="handleAccountLinkClick(event)">
                        <img src="hinhAnh/userHomeIcon.png" id="userIconImg" width="16" class="me-1 opacity-75">
                        <span id="userAccountText">Đăng nhập</span>
                    </a>
                </div>
            </div>
        </div>
        <div class="container-fluid rowMenu bg-white sticky-top shadow-sm py-3">
            <div class="container d-flex align-items-center justify-content-between">

                <div class="logo d-flex justify-content-start" style="flex: 1;">
                    <a href="homePage.html"><img src="hinhAnh/logo.jpg" alt="Logo" id="logoHome"
                            style="height: 100px; width: 200px;"></a>
                </div>

                <div class="menu-toggle d-lg-none" style="cursor: pointer;" onclick="toggleMenu()">
                    <span class="bar"></span>
                    <span class="bar"></span>
                    <span class="bar"></span>
                </div>
                <nav class="menu d-none d-lg-flex justify-content-center mt-4" id="nav-menu" style="flex: 2;">

                    <div class="dropdown">
                        <a href="#" class="text-dark text-decoration-none menu-link">SẢN PHẨM <small>▾</small></a>
                        <div class="mega-menu p-5">
                            <div class="container image-grid text-center">
                                <a href="catalog.html?gender=Nam" class="text-decoration-none text-white">
                                    <div class="mega-item"><img src="hinhAnh/forMen.png" class="img-fluid mb-2">
                                        <p>CHO NAM</p>
                                    </div>
                                </a>
                                <a href="catalog.html?gender=Nữ" class="text-decoration-none text-white">
                                    <div class="mega-item"><img src="hinhAnh/forWoman.png" class="img-fluid mb-2">
                                        <p>CHO NỮ</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown">
                        <a href="#" class="text-dark text-decoration-none menu-link">NAM <small>▾</small></a>
                        <div class="mega-menu p-5 text-start">
                            <div class="container text-columns">
                                <div class="column">
                                    <h3>NỔI BẬT</h3>
                                    <a href="catalog.html?gender=Nam&badge=Best Seller">Best Seller</a>
                                    <a href="catalog.html?gender=Nam&badge=New Arrival">New Arrival</a>
                                    <a href="catalog.html?gender=Nam&badge=Sale Off">Sale off</a>
                                </div>
                                <div class="column dashed-border">
                                    <h3>GIÀY NAM</h3>
                                    <p class="sub-heading">Dòng sản phẩm</p>
                                    <a href="catalog.html?gender=Nam&category=Sneakers">Sneakers</a>
                                    <a href="catalog.html?gender=Nam&category=Running">Giày chạy bộ</a>
                                    <a href="catalog.html?gender=Nam&category=Classic">Giày cổ điển</a>
                                    <a href="catalog.html?gender=Nam&category=Dép">Dép</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="dropdown">
                        <a href="#" class="text-dark text-decoration-none menu-link">NỮ <small>▾</small></a>
                        <div class="mega-menu p-5 text-start">
                            <div class="container text-columns">
                                <div class="column">
                                    <h3>NỔI BẬT</h3>
                                    <a href="catalog.html?gender=Nữ&badge=Best Seller">Best Seller</a>
                                    <a href="catalog.html?gender=Nữ&badge=New Arrival">New Arrival</a>
                                    <a href="catalog.html?gender=Nữ&badge=Sale Off">Sale off</a>
                                </div>
                                <div class="column dashed-border">
                                    <h3>GIÀY NỮ</h3>
                                    <p class="sub-heading">Dòng sản phẩm</p>
                                    <a href="catalog.html?gender=Nữ&category=Sneakers">Sneakers</a>
                                    <a href="catalog.html?gender=Nữ&category=Running">Giày chạy bộ</a>
                                    <a href="catalog.html?gender=Nữ&category=Classic">Giày cổ điển</a>
                                    <a href="catalog.html?gender=Nữ&category=Dép">Dép</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <a href="catalog.html?badge=Sale Off" class="text-dark text-decoration-none menu-link">SALE
                        OFF</a>
                </nav>

                <div class="searchBar d-none d-lg-flex mt-4" style="flex: 1; justify-content: flex-end;">
                    <input type="text" class="form-control rounded-pill custom-search"
                        onkeyup="if(window.handleCatalogSearch) { handleCatalogSearch(event, this) } else { handleGeneralSearch(event, this) }" onsearch="if(window.handleCatalogSearchClear) handleCatalogSearchClear(this)" placeholder="Tìm kiếm sản phẩm...">
                </div>

            </div>
        </div>
`;

function injectHeader() {
    const headerContainer = document.getElementById('main-header');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
    }
}
injectHeader();
