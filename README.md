# CSN-DA23TTA - Lê Trung Hiếu - Hệ Thống Diễn Đàn (NoSQL)

---

## 1. THÔNG TIN TÁC GIẢ
- **Giảng viên hướng dẫn:** Phan Thị Phương Nam

- **Sinh viên thực hiện:** Lê Trung Hiếu
- **Mã số sinh viên:** 110123011
- **Mã lớp:** DA23TTA
- **Liên hệ:** leluongdienthoaiiiii345@gmail.com

---

## 2. GIỚI THIỆU ĐỒ ÁN & CHỨC NĂNG CHÍNH
### **Mô tả ngắn:**

Dự án xây dựng Backend cho một hệ thống diễn đàn (Forum) sử dụng MongoDB (NoSQL) với mục tiêu mô phỏng các tính năng cơ bản: quản lý cộng đồng, bài viết, bình luận, và hệ thống bình chọn.

### **Các chức năng chính:**
- Quản lý người dùng: đăng ký, cập nhật thông tin, phân quyền cơ bản.

- Hệ thống cộng đồng (Community): tạo cộng đồng, quản lý thành viên, phân quyền Admin/Moderator.
- Bài viết (Posts): tạo, sửa, xóa, phân loại (Top, New, Old).
- Bình luận (Comments): hỗ trợ bình luận lồng nhau (nested comments) theo bài viết.
- Bình chọn (Votes): hỗ trợ upvote/downvote với cập nhật nguyên tử.
- Thống kê (Statistics): thu thập số liệu cơ bản như số bài, số bình luận, lượt vote.
- Hỗ trợ nạp dữ liệu thử nghiệm từ file CSV và script sinh dữ liệu giả.

---

## 3. CÔNG NGHỆ SỬ DỤNG
- Node.js (CommonJS)

- Express.js
- MongoDB với Mongoose
- dotenv (quản lý biến môi trường)
- csv-parser (xử lý CSV)
- @faker-js/faker (tạo dữ liệu giả)

**Cấu trúc thư mục chính:**
```
.
├── data/                   # Chứa dữ liệu thô và scripts khởi tạo
│   ├── csv/                # Các file .csv chứa dữ liệu mẫu
│   └── gen_fake_data.js    # Script tự động tạo dữ liệu giả (Faker)
├── src/                    # Thư mục mã nguồn chính
│   ├── config/             # Cấu hình hệ thống (Kết nối DB, biến môi trường)
│   ├── controllers/        # Xử lý logic nghiệp vụ cho từng API
│   ├── models/             # Định nghĩa Schema (Lược đồ) Mongoose cho MongoDB
│   ├── routes/             # Định nghĩa các đường dẫn (endpoints) API
│   ├── middlewares/        # Các hàm trung gian (Kiểm tra quyền, validate dữ liệu)
│   └── server.js           # Điểm khởi đầu của ứng dụng (Entry point)
├── test/                   # Các file kịch bản kiểm thử API
├── .env.example            # File mẫu cấu hình biến môi trường
├── package.json            # Quản lý thư viện và scripts của dự án
└── README.md               # Hướng dẫn dự án
```
---

## 5. HƯỚNG DẪN CÀI ĐẶT (Installation Guide) ⚙️
### Yêu cầu
- Node.js (LTS khuyến nghị)
- MongoDB (Atlas hoặc self‑hosted)

### Các bước cài đặt
1. Clone repository:
```bash
git clone <repo-url>
cd <project-folder>
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Cấu hình biến môi trường:
- Copy file mẫu:
```bash
copy .env.example .env
```
- Mở `.env` và cấu hình kết nối MongoDB, ví dụ:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/<dbname>?retryWrites=true&w=majority
PORT=5000
```
> Lưu ý: Hệ thống hiện chấp nhận `MONGODB_URI` (hoặc `MONGO_URI`), nên bạn có thể dùng tên biến phù hợp với môi trường của mình.

4. Thêm npm scripts (nếu muốn):
- Bạn có thể thêm vào `package.json`:
```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js"
}
```

5. Chạy ứng dụng:
- Chế độ thông thường:
```bash
npm start
```
- Chế độ phát triển (nếu dùng nodemon):
```bash
npm run dev
```
Mặc định server lắng nghe trên `http://localhost:5000`.

6. Kiểm tra các endpoint chính:

- `GET /` → trả về `API is running...`

- `POST|GET /api/users`
- `POST|GET /api/communities`
- `POST|GET /api/posts`
- `POST|GET /api/comments`
- `POST|GET /api/votes`

### Nạp dữ liệu thử nghiệm
- Thư mục `data/` chứa các file CSV và script.
Ví dụ: 

- `gen_fake_data.js` để sinh và nạp dữ liệu mẫu lớn (dữ liệu hoàn toàn tạo bởi faker.js, không theo quy chuẩn logic, và mẫu dữ liệu lớn.)

- `new_csvgen.js` để sinh và nạp dữ liệu mẫu nhỏ (dữ liệu được tạo một phần bởi mô hình ngôn ngữ, tuân thủ theo quy chuẩn logic giả định.)

---

## HƯỚNG DẪN KHỞI TẠO & CHẠY THỬ 🔁
Dưới đây là các bước chi tiết để khởi tạo, chạy server, nạp dữ liệu thử và kiểm thử API bằng Postman hoặc VS Code REST Client.

### 1) Khởi tạo schema & index trên MongoDB (Init DB)
- Mục đích: đồng bộ index và áp dụng validation schema vào các collection.
- Câu lệnh:
```bash
node src/config/initSchema.js
```
- Ghi chú: script này sẽ kết nối tới DB dùng `MONGODB_URI` từ `.env` và sau đó đóng kết nối.

### 2) Chạy server
- Nếu đã thêm script `start` vào `package.json` (hoặc dùng trực tiếp):
```bash
npm start
# hoặc
node src/server.js
```
- Khi server chạy thành công, bạn sẽ thấy log tương tự:
```
Server running on port 5000
DB connection successful.
Database selected/in use: <your-db-name>
```

### 3) Nạp dữ liệu thử (seeding)
- Chạy script nạp dữ liệu lớn (mất thời gian tùy số lượng):
```bash
node data/gen_fake_data.js
```
- Chạy script nạp dữ liệu mẫu nhỏ / khác:
```bash
node data/new_csvgen.js
node data/commenttest.js
```
- Kiểm tra dữ liệu bằng MongoDB Compass hoặc bằng các API GET (ví dụ `GET /api/posts`, `GET /api/users`).

### 4) Kiểm thử API bằng Postman ✅
- Mở Postman → tạo một **Collection** mới → thêm biến môi trường `baseUrl` = `http://localhost:5000`.
- Ví dụ một request POST tạo user:
  - URL: `{{baseUrl}}/api/users`
  - Method: POST
  - Body (JSON):
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```
- Ví dụ request GET danh sách bài viết:
  - URL: `{{baseUrl}}/api/posts`
  - Method: GET
- Lưu các request vào collection để dễ reuse, dùng Pre-request Script và Tests nếu cần.

### 5) Kiểm thử API bằng REST Client (VS Code) 🧪
- Cài extension **REST Client**.
- Tạo file `http` (ví dụ `api-tests.http`) với nội dung mẫu:
```
# Lấy danh sách bài viết
GET http://localhost:5000/api/posts

### Tạo user
POST http://localhost:5000/api/users
Content-Type: application/json

{
  "username": "restclient",
  "email": "rest@example.com",
  "password": "pass123"
}
```
- Click `Send Request` trên từng khối để gửi và xem response ngay trong VS Code.

---

File `test/api-tests.http` có một số request mẫu để bạn có thể dùng **REST Client** (VS Code) hoặc chuyển sang **Postman** 
## Các npm scripts hữu ích:

- `npm run init-db` → khởi tạo schema & validation (`node src/config/initSchema.js`)

- `npm run seed` → nạp dữ liệu mẫu lớn (`node data/gen_fake_data.js`)
- `npm run seed-small` → nạp dữ liệu mẫu nhỏ (`node data/new_csvgen.js`)
- `npm start` → chạy server
- `npm run dev` → chạy server với `nodemon` (live reload)

