👟 Basau Sneakers - Website Cửa Hàng Giày Trực Tuyến

Basau Sneakers là một dự án website thương mại điện tử giao diện Front-end hiện đại, tập trung vào trải nghiệm người dùng trong việc tìm kiếm và mua sắm các dòng giày sneaker từ các thương hiệu lớn như Nike, Adidas, New Balance, v.v. Dự án tích hợp đầy đủ các tính năng xác thực người dùng cơ bản sử dụng LocalStorage.

✨ Tính Năng Nổi Bật

🔐 Hệ Thống Xác Thực (Authentication)

Đăng nhập/Đăng ký: Hỗ trợ phân quyền người dùng (Nhân viên và Khách hàng).

Quên mật khẩu: Quy trình khôi phục mật khẩu qua 2 bước (Kiểm tra tài khoản -> Cập nhật mật khẩu mới).

Hiển thị mật khẩu: Tính năng ẩn/hiện mật khẩu giúp người dùng kiểm tra độ chính xác khi nhập.

Lưu trữ LocalStorage: Dữ liệu tài khoản được lưu trữ cục bộ, cho phép duy trì trạng thái đăng nhập khi tải lại trang.

🎨 Giao Diện Người Dùng (UI/UX)

Mega Menu: Menu điều hướng thông minh, hiển thị danh mục sản phẩm trực quan với hình ảnh minh họa.

Hero Slider: Banner chuyển động mượt mà (Carousel) giới thiệu các bộ sưu tập mới nhất theo phong cách Nike/Adidas.

Flash Sale: Banner đếm ngược tạo cảm giác cấp bách cho các chương trình khuyến mãi.

Thiết kế Responsive: Tương thích hoàn toàn với các thiết bị di động (Mobile) thông qua hệ thống Grid của Bootstrap và Menu 3 gạch (Hamburger menu).

🛠 Công Nghệ Sử Dụng
HTML5 & CSS3: Cấu trúc và định dạng giao diện nghệ thuật với font chữ Josefin Sans và Oswald.

Bootstrap 5: Thư viện framework giúp xây dựng giao diện nhanh và hỗ trợ Responsive.

JavaScript (Vanilla JS): Xử lý logic đăng nhập, đăng ký, điều khiển DOM và quản lý LocalStorage.

📂 Cấu Trúc Thư Mục

Plaintext
├── hinhAnh/           # Thư mục chứa hình ảnh sản phẩm, banner, icons
├── stylesMain.css     # CSS chính cho trang chủ và các thành phần chung
├── stylesLogin.css    # CSS riêng biệt cho trang đăng nhập/đăng ký
├── script.js          # Logic JavaScript xử lý toàn bộ website
├── homePage.html      # Trang chủ chính của dự án
└── login.html         # Trang đăng nhập, đăng ký và quên mật khẩu
🚀 Hướng Dẫn Cài Đặt

Tải dự án:

Bash
git clone https://github.com/your-username/basau-sneakers.git
Chuẩn bị hình ảnh: Đảm bảo các tệp hình ảnh trong thư mục hinhAnh/ đúng tên theo mã nguồn để hiển thị chính xác.

Khởi chạy: Mở tệp homePage.html bằng trình duyệt web bất kỳ hoặc sử dụng extension Live Server trên VS Code.

📝 Tài Khoản Mẫu (Mặc định)

Khi chạy lần đầu, hệ thống sẽ tự động khởi tạo dữ liệu mẫu trong LocalStorage:
Email	              Mật khẩu	Quyền
quan02077@gmail.com	123456	Nhân viên
A123@gmail.com	      123456	Khách hàng
📌 Lưu Ý

Dự án hiện tại là bản Front-end duy nhất, toàn bộ dữ liệu người dùng được lưu trong bộ nhớ trình duyệt (LocalStorage). Nếu bạn xóa cache trình duyệt, dữ liệu đăng ký mới sẽ biến mất.

Các nút "Thêm vào giỏ" và "Tìm kiếm" hiện đang đóng vai trò làm mẫu giao diện (Mockup).

© 2026 BASAU SNEAKERS. All rights reserved.
