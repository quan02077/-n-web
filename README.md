<div align="center">

# 👟 Website Cửa Hàng Bán Giày Thể Thao

**Dự án Đồ án cuối kỳ - Môn Thiết kế Web**

Dự án xây dựng một hệ thống website thương mại điện tử chuyên cung cấp các mặt hàng giày thể thao, được phát triển hoàn toàn trên nền tảng Frontend tĩnh với khả năng xử lý nghiệp vụ bán hàng thời gian thực thông qua bộ nhớ trình duyệt.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

</div>

<br/>

## 👨‍💻 Thông tin nhóm thực hiện

Dự án được phân tích, thiết kế và lập trình bởi:
- **Nguyễn Nhật Minh Quân** (Trưởng nhóm)
- **Lương Văn Quan**
- **Ngụy Hạo Nhiên**
- **Hồ Đại Phong**

---

## 🌟 Giới thiệu dự án

Mục tiêu của dự án là xây dựng một trang web bán hàng hiện đại, có giao diện thân thiện với người dùng và tương thích 100% trên các thiết bị di động (Responsive). Thay vì kết nối với Backend Server, hệ thống áp dụng kỹ thuật thao tác trực tiếp với **Local Storage** để quản lý cơ sở dữ liệu. Nhờ đó, trải nghiệm người dùng (UX) diễn ra rất mượt mà, bao gồm tất cả các luồng từ lúc xem sản phẩm, đăng nhập, thêm vào giỏ hàng cho đến khi thanh toán.

## 🚀 Các tính năng chính

### 🛒 Dành cho Khách hàng
* **Xác thực người dùng:** Đăng ký, đăng nhập và bảo mật thông tin bằng Local Storage.
* **Quản lý Tài khoản:** Xem lịch sử đơn hàng, cập nhật thông tin cá nhân và thay đổi mật khẩu thông qua Side Panel tiện lợi.
* **Tìm kiếm & Phân loại:**
  * Lọc sản phẩm theo danh mục (Sneaker, Running, Classic, Dép).
  * Lọc theo đối tượng (Nam, Nữ) và theo sự kiện (Sale Off, Best Seller).
  * Thanh tìm kiếm toàn cục đa năng.
* **Giỏ hàng (Cart):** Thêm, xóa, tính tổng tiền tự động, và điều chỉnh số lượng mua ngay lập tức mà không cần tải lại trang.
* **Yêu thích (Wishlist):** Lưu danh sách các sản phẩm quan tâm theo từng tài khoản cá nhân độc lập.

### ⚙️ Dành cho Quản trị viên
* **Admin Dashboard:** Bảng điều khiển trực quan để thao tác với dữ liệu cửa hàng.
* **Quản lý Sản phẩm (CRUD):** Thêm mới, chỉnh sửa, xóa và cập nhật hình ảnh, giá cả của sản phẩm. Các thay đổi ngay lập tức được đồng bộ lên giao diện cửa hàng của khách hàng.

## 🛠 Công nghệ cốt lõi

* **Ngôn ngữ Frontend:** HTML5, CSS3, JavaScript (ES6).
* **Framework giao diện:** Bootstrap 5.3 (Sử dụng Grid system, Flexbox, UI Components).
* **Lưu trữ dữ liệu:** Window `localStorage` API.
* **Mô hình kiến trúc:** Component-based (Tách rời các module dùng chung như Header, Navbar vào từng file JS độc lập nhằm tối ưu hóa việc bảo trì và nâng cấp mã nguồn).

## 🚀 Hướng dẫn khởi chạy

Do tính chất là một website tĩnh (Static Website), việc khởi chạy dự án cực kỳ đơn giản:

1. **Tải mã nguồn** về máy tính và giải nén.
2. Mở thư mục dự án bằng trình soạn thảo mã nguồn như **Visual Studio Code**.
3. Khởi chạy dự án thông qua tiện ích **Live Server**.
4. Trải nghiệm tại địa chỉ `http://127.0.0.1:5500/homePage.html` (hoặc cổng tương ứng của bạn).
5. Bạn có thể đăng ký tài khoản tại mục Đăng nhập để sử dụng tính năng mua hàng, hoặc truy cập `admin.html` để trải nghiệm luồng Quản trị viên.

---
*Dự án hoàn thành đáp ứng đầy đủ tiêu chí của bộ môn Thiết kế Web.*
