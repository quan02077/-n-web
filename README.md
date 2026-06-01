# 👟 Đồ Án Web: Cửa Hàng Bán Giày Thể Thao (Sneaker Store)

Đây là đồ án cuối kỳ môn học Thiết kế Web. Website được xây dựng hoàn toàn bằng **HTML5, CSS3, JavaScript thuần (Vanilla JS)** và kết hợp với hệ thống lưới của **Bootstrap 5** để tối ưu hóa hiển thị trên mọi thiết bị (Responsive). 

Đặc biệt, hệ thống sử dụng **Local Storage** để lưu trữ cơ sở dữ liệu (tài khoản, sản phẩm, giỏ hàng...), giúp website hoạt động mượt mà với đầy đủ các tính năng như một website động (Dynamic Web) mà không cần đến Backend (Server-side).

---

## 🚀 Các Tính Năng Nổi Bật

### 1. Giao Diện (UI/UX)
- Thiết kế trẻ trung, năng động, bám sát các website thương mại điện tử hiện đại.
- **Responsive 100%:** Hiển thị hoàn hảo trên cả máy tính (Desktop) và điện thoại (Mobile). Tự động chuyển đổi sang Hamburger Menu ở màn hình nhỏ.
- Áp dụng các hiệu ứng Hover, Transition, Modal/Side-panel, Overlay chuyên nghiệp.
- Code được tổ chức dạng Module (tách riêng `header.js`, `header.css` dùng chung cho toàn dự án) giúp hạn chế tối đa lặp code và dễ dàng bảo trì.

### 2. Phía Khách Hàng (User)
- **Đăng ký / Đăng nhập:** Hệ thống xác thực tài khoản cơ bản lưu ở Local Storage.
- **Duyệt sản phẩm (Catalog):** 
  - Lọc sản phẩm theo Phân loại (Sneakers, Chạy bộ, Cổ điển, Dép).
  - Lọc theo Giới tính (Nam, Nữ) và Nhãn (Best Seller, New Arrival, Sale Off).
  - Thuật toán **Phân trang (Pagination)** xử lý mảng Javascript.
- **Tìm kiếm:** Thanh tìm kiếm đa năng trên Navbar.
- **Giỏ hàng (Cart):** Side panel trượt mượt mà. Hỗ trợ thêm sản phẩm, thay đổi số lượng, tự động tính tổng tiền và xóa sản phẩm khỏi giỏ. 
- **Yêu thích (Wishlist):** Thêm/xóa sản phẩm vào danh sách yêu thích (lưu theo từng user độc lập).
- **Quản lý Tài khoản:** Cập nhật thông tin cá nhân, đổi mật khẩu và xem lại lịch sử mua hàng.
- **Thanh toán (Checkout):** Chức năng điền thông tin và thanh toán.

### 3. Phía Quản Trị (Admin)
- Giao diện Admin quản lý trực quan (`admin.html`).
- **CRUD Sản Phẩm:** Cho phép admin Thêm mới, Chỉnh sửa, Xóa và Tìm kiếm sản phẩm trong kho.
- Các thay đổi của admin sẽ được lưu vào `localStorage`, ngay lập tức đồng bộ hiển thị lên các trang Khách hàng (như Homepage và Catalog).

---

## 📁 Cấu Trúc Thư Mục Chú Ý

- `index.html` / `homePage.html`: Trang chủ của website.
- `catalog.html`: Trang danh sách sản phẩm.
- `productDetail.html`: Trang chi tiết sản phẩm.
- `login.html`: Cổng đăng nhập / đăng ký.
- `admin.html`: Bảng điều khiển quản trị viên.
- `checkout.html`: Trang thanh toán.
- `flashSale.html`: Landing page chương trình ưu đãi đếm ngược.
- **Thư mục CSS:** Các file CSS (như `stylesMain.css`, `header.css`, `sidepanels.css`...)
- **Thư mục JS:** Chứa logic xử lý nghiệp vụ (`data.js` lưu mock-data, `script.js` xử lý hiển thị, `cart.js`, `account.js`, `admin.js`...).

---

## 💻 Cách Cài Đặt Và Chạy Thử
Vì website sử dụng hoàn toàn mã tĩnh (Front-end), bạn không cần cài đặt môi trường server phức tạp.

1. Tải toàn bộ mã nguồn về máy tính.
2. Giải nén (nếu ở định dạng zip).
3. Sử dụng extension **Live Server** trên VSCode, hoặc nhấp đúp trực tiếp vào file `homePage.html` (hoặc `login.html`) để mở trên trình duyệt (Chrome, Cốc Cốc, Edge...).
4. Đăng ký một tài khoản mới để trải nghiệm đầy đủ tính năng Giỏ hàng và Mua hàng.
5. Để vào giao diện Quản trị viên, bạn có thể tự tạo tài khoản admin (sửa role trong Code hoặc Local Storage) và truy cập vào `admin.html`.

---
*Đồ án được thực hiện nhằm mục đích học tập và báo cáo môn học.*
