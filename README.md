<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![LocalStorage](https://img.shields.io/badge/LocalStorage-4D4D4D?style=for-the-badge&logo=databricks&logoColor=white)

<br/>

# 👟 Website Cửa Hàng Bán Giày Thể Thao

Ứng dụng web bán hàng thương mại điện tử chuyên về giày thể thao, xây dựng bằng **HTML, CSS, JS thuần** kết hợp **Bootstrap 5**, giao diện Responsive và xử lý logic bằng **Local Storage**.

**Đồ án cuối kỳ — Môn Thiết Kế Web**

[![Downloads](https://img.shields.io/badge/Tải_Mã_Nguồn-v1.0.0-blue?style=flat-square)](#)
[![Stars](https://img.shields.io/badge/stars-0-gray?style=flat-square)](#)
[![Issues](https://img.shields.io/badge/issues-0_open-gray?style=flat-square)](#)

</div>

<br/>

## Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng nổi bật](#-tính-năng-nổi-bật)
- [Công nghệ sử dụng](#-công-nghệ-sử-dụng)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Cấu trúc thư mục](#-cấu-trúc-thư-mục)
- [Hướng dẫn cài đặt & Cấu hình](#-hướng-dẫn-cài-đặt--cấu-hình)
- [Thông tin nhóm](#-thông-tin-nhóm)
- [Tài liệu tham khảo](#-tài-liệu-tham-khảo)

<hr/>

## 🌟 Giới thiệu
Đây là dự án xây dựng Front-end cho một website bán giày thể thao với đầy đủ luồng nghiệp vụ của một trang thương mại điện tử thực tế. Đặc điểm nổi bật nhất của dự án là không sử dụng Backend (Server-side) mà lưu trữ toàn bộ dữ liệu giỏ hàng, thông tin người dùng và kho sản phẩm tại trình duyệt của khách hàng thông qua **Local Storage**, tạo ra trải nghiệm mượt mà như một ứng dụng web thực thụ.

## ✨ Tính năng nổi bật

### Dành cho Khách hàng (User)
- **Hệ thống Tài khoản:** Đăng ký, đăng nhập, đổi mật khẩu và cập nhật thông tin cá nhân.
- **Trải nghiệm mua sắm:**
  - Lọc sản phẩm đa chiều (Theo danh mục, giới tính, trạng thái Sale/New).
  - Thanh tìm kiếm trực quan.
  - Hỗ trợ phân trang (Pagination) thông minh.
- **Giỏ hàng & Thanh toán:** Thêm/xóa sản phẩm, tính toán tự động tổng tiền, form điền thông tin Checkout.
- **Danh sách Yêu thích:** Lưu lại các đôi giày yêu thích theo từng tài khoản riêng biệt.

### Dành cho Quản trị viên (Admin)
- **Quản lý Kho hàng:** Bảng điều khiển riêng (`admin.html`) để Thêm, Sửa, Xóa thông tin sản phẩm trực tiếp. Mọi thay đổi lập tức được đồng bộ lên giao diện khách hàng.

## 🛠 Công nghệ sử dụng
- **Cốt lõi:** HTML5, CSS3, JavaScript (ES6)
- **Thư viện UI:** Bootstrap 5.3 (Sử dụng hệ thống Grid, Modal, Carousel, Buttons...)
- **Lưu trữ dữ liệu:** Window `localStorage` API
- **Kiến trúc mã nguồn:** Tách riêng các Component (header, footer, sidepanels) thành từng file JS, CSS độc lập để dễ dàng tái sử dụng (Modular Design).

## 🧩 Kiến trúc hệ thống
Dự án được thiết kế theo mô hình **Tĩnh hoàn toàn (Static SPA-like)**:
1. **Mock Data:** Khởi tạo kho dữ liệu mồi thông qua file `data.js`.
2. **Component Injection:** Dùng hàm Javascript để nối các thẻ HTML dùng chung (như Navbar) vào các trang thông qua các ID định sẵn (VD: `<div id="main-header"></div>`).
3. **State Management:** Mọi thao tác click thêm/xóa/sửa đều gọi trực tiếp vào bộ nhớ cục bộ `localStorage`, sau đó Render lại giao diện.

## 📁 Cấu trúc thư mục

```text
DoAnWeb/
├── hinhAnh/              # Thư mục chứa hình ảnh sản phẩm và banner
├── bootstrap-5.3.8-dist/ # Bộ thư viện Bootstrap tải cục bộ
├── index.html            # Trang chủ (homePage.html)
├── catalog.html          # Trang danh sách và lọc sản phẩm
├── productDetail.html    # Trang chi tiết 1 sản phẩm
├── checkout.html         # Trang điền thông tin đặt hàng
├── login.html            # Trang Đăng nhập/Đăng ký
├── admin.html            # Trang bảng điều khiển quản trị
├── stylesMain.css        # CSS tổng quan của toàn trang
├── header.css            # CSS dành riêng cho thanh điều hướng
├── script.js             # Javascript xử lý logic chung
├── data.js               # Chứa mảng dữ liệu mồi ban đầu
├── header.js             # Script khởi tạo component Header
├── account.js            # Xử lý logic tài khoản người dùng
└── ...                   # Các file JS, CSS phụ trợ khác
```

## 🚀 Hướng dẫn cài đặt & Cấu hình

Dự án không yêu cầu cài đặt NodeJS hay Database phức tạp. Để chạy dự án:

1. **Tải mã nguồn** về máy (Download ZIP hoặc `git clone`).
2. Mở thư mục dự án bằng **Visual Studio Code**.
3. Cài đặt tiện ích mở rộng **Live Server** trên VS Code.
4. Click chuột phải vào file `homePage.html` và chọn **"Open with Live Server"**.
5. *Lưu ý:* Để vào trang Admin, bạn có thể tạo một tài khoản mới và truy cập thẳng vào đường dẫn `/admin.html`.

## 👥 Thông tin nhóm
*Dành cho sinh viên tự điền thông tin báo cáo*
- **Thành viên 1:** [Họ và tên] - [Mã sinh viên] - [Nhiệm vụ]
- **Thành viên 2:** [Họ và tên] - [Mã sinh viên] - [Nhiệm vụ]

## 📚 Tài liệu tham khảo
- [Tài liệu Bootstrap 5.3](https://getbootstrap.com/docs/5.3/getting-started/introduction/)
- [MDN Web Docs - LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [W3Schools - HTML/CSS/JS Tutorials](https://www.w3schools.com/)
