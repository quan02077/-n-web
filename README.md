

# 👟 Basau Sneakers - Website Cửa Hàng Giày Trực Tuyến

**Basau Sneakers** là một dự án website thương mại điện tử giao diện Front-end hiện đại, được tối ưu hóa cho trải nghiệm mua sắm sneaker chuyên nghiệp. Dự án mô phỏng luồng trải nghiệm thực tế từ việc xem danh sách sản phẩm, đăng nhập phân quyền cho đến xem chi tiết sản phẩm động.

---

## ✨ Tính Năng Nổi Bật

### 🔐 Hệ Thống Xác Thực (Authentication)
* **Đăng nhập/Đăng ký**: Hỗ trợ phân quyền người dùng (**Nhân viên** và **Khách hàng**).
* **Quên mật khẩu**: Quy trình khôi phục mật khẩu qua 2 bước bảo mật.
* **Lưu trữ LocalStorage**: Dữ liệu tài khoản và trạng thái đăng nhập được duy trì cục bộ trên trình duyệt.

### 🛍️ Trải Nghiệm Mua Sắm Động (Dynamic UX)
* **Trang Chi Tiết Động**: Sử dụng URL Parameters (`?id=...`) để hiển thị thông tin chính xác cho từng loại giày từ một file dữ liệu tập trung.
* **Chuyển Đổi Hình Ảnh**: Tính năng xem ảnh chi tiết (Thumbnails) và chọn màu sắc tương tác.
* **Gợi Ý Sản Phẩm**: Mục "You Might Also Like" với hiệu ứng hover và trượt ngang mượt mà trên mobile.

### 🎨 Giao Diện (UI/UX)
* **Phong cách Nike/Adidas**: Sử dụng phông chữ *Oswald* và *Josefin Sans* tạo cảm giác thể thao, cao cấp.
* **Thiết kế Responsive**: Tương thích hoàn toàn với Mobile/Tablet thông qua hệ thống Grid của Bootstrap 5 và Menu Hamburger.

---

## 🛠 Công Nghệ Sử Dụng

* **Ngôn ngữ**: HTML5, CSS3, JavaScript (Vanilla JS).
* **Framework**: Bootstrap 5.
* **Lưu trữ**: LocalStorage API.

---

## 📂 Cấu Trúc Thư Mục

```text
├── hinhAnh/           # Hình ảnh sản phẩm, banner và icons
├── data.js            # "Cơ sở dữ liệu" giả lập chứa thông tin 8 sản phẩm chính
├── script.js          # Xử lý logic đăng nhập và trang chủ
├── scriptDetail.js    # Xử lý logic hiển thị động cho trang chi tiết
├── stylesMain.css     # CSS tổng quát cho toàn bộ website
├── stylesDetail.css   # CSS chuyên biệt cho trang chi tiết sản phẩm
├── homePage.html      # Trang chủ hiển thị danh sách sản phẩm
└── productDetail.html # Trang chi tiết sản phẩm (Dùng chung cho tất cả ID)
```

---

## 🚀 Hướng Dẫn Cài Đặt

1.  **Tải dự án**:
    ```bash
    git clone [https://github.com/your-username/basau-sneakers.git](https://github.com/your-username/basau-sneakers.git)
    ```
2.  **Khởi chạy**: Mở tệp `homePage.html` bằng trình duyệt web. Khuyến khích sử dụng extension **Live Server** trên VS Code để có trải nghiệm tốt nhất.

---

## 📝 Tài Khoản Mẫu

Hệ thống tự động khởi tạo dữ liệu mẫu khi bạn truy cập lần đầu:

| Email | Mật khẩu | Quyền hạn |
| :--- | :--- | :--- |
| `quan02077@gmail.com` | `123456` | Nhân viên |
| `A123@gmail.com` | `123456` | Khách hàng |

---

**© 2026 BASAU SNEAKERS. Thiết kế và phát triển bởi Nhóm 6.**
```
