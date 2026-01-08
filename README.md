# CSN-DA23TTA - Lê Trung Hiếu - Hệ Thống Diễn Đàn (NoSQL)
## Sinh viên thực hiện: Lê Trung Hiếu
  Đây là dự án xây dựng hệ thống Backend cho Diễn đàn (Forum) sử dụng cơ sở dữ liệu NoSQL (MongoDB). Dự án tập trung vào việc xử lý các logic phức tạp như phân quyền cộng đồng, hệ thống bình chọn (voting) và phân cấp bình luận.

## Hướng dẫn cài đặt và thiết lập (Setup Guide)

Làm theo các bước dưới đây để triển khai dự án trên môi trường cục bộ (Local Machine).

- **Bước 1: Cài đặt Node.js**

Truy cập trang chủ Node.js.

Tải về và cài đặt phiên bản LTS (khuyên dùng để đảm bảo tính ổn định).

Sau khi cài đặt, kiểm tra bằng cách mở Terminal/Command Prompt và gõ:

node -v
npm -v


- **Bước 2: Tải mã nguồn**

Tải file ZIP của dự án về máy và giải nén.

Mở thư mục dự án bằng trình soạn thảo mã nguồn (khuyên dùng VS Code).

- **Bước 3: Cài đặt các thư viện (Dependencies)**

Dự án sử dụng file package.json và package-lock.json để quản lý các thư viện cần thiết. Để cài đặt tất cả các thư viện này, hãy mở Terminal tại thư mục gốc của dự án và chạy lệnh:

npm install


Lệnh này sẽ tự động đọc danh sách các gói tin trong package.json và tải về thư mục node_modules.

- **Bước 4: Cấu hình biến môi trường**

Tạo một file có tên .env tại thư mục gốc (nếu chưa có) và thêm các thông tin cấu hình sau:

PORT=5000
MONGO_URI=your_mongodb_connection_string


(Thay thế your_mongodb_connection_string bằng đường dẫn kết nối tới MongoDB của bạn).

- **Bước 5: Chạy ứng dụng**

Sau khi cài đặt hoàn tất, bạn có thể khởi động Server bằng một trong hai lệnh sau:

Chế độ thông thường:

npm start


Chế độ phát triển (Tự động tải lại khi sửa code):

npm run dev


Hệ thống sẽ chạy tại địa chỉ: http://localhost:5000

Cấu trúc thư mục chính

/config: Cấu hình kết nối cơ sở dữ liệu (MongoDB).

/controllers: Xử lý logic nghiệp vụ cho từng thực thể (User, Post, Community...).

/models: Định nghĩa các Schema NoSQL (Mongoose).

/routes: Định nghĩa các Endpoint API và điều phối yêu cầu.

server.js: Tệp cấu hình trung tâm và điểm khởi đầu của ứng dụng.

## Các tính năng chính

User Management: Đăng ký, cập nhật thông tin và quản lý tài khoản.

Community System: Tạo cộng đồng, phân quyền Admin/Moderator.

Post & Interaction: Đăng bài viết, phân loại (Top, New, Old).

Advanced Voting: Hệ thống Upvote/Downvote xử lý cập nhật nguyên tử (Atomic Update).

Nested Comments: Hệ thống bình luận theo bài viết và quản lý số lượng bình luận.

