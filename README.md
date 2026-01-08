# CSN-DA23TTA - Lê Trung Hiếu - Hệ Thống Diễn Đàn (NoSQL)

---

## 1. THÔNG TIN TÁC GIẢ ✍️
- **Giảng viên hướng dẫn:** Phan Thị Phương Nam
- **Sinh viên thực hiện:** Lê Trung Hiếu
- **Mã số sinh viên:** 110123011
- **Mã lớp:** DA23TTA
- **Liên hệ:** (thêm email hoặc thông tin liên hệ nếu cần)

---

## 2. GIỚI THIỆU ĐỒ ÁN & CHỨC NĂNG CHÍNH 💡
**Mô tả ngắn:**
Dự án xây dựng Backend cho một hệ thống diễn đàn (Forum) sử dụng MongoDB (NoSQL) với mục tiêu mô phỏng các tính năng cơ bản: quản lý cộng đồng, bài viết, bình luận, và hệ thống bình chọn.

**Các chức năng chính:**
- Quản lý người dùng: đăng ký, cập nhật thông tin, phân quyền cơ bản.
- Hệ thống cộng đồng (Community): tạo cộng đồng, quản lý thành viên, phân quyền Admin/Moderator.
- Bài viết (Posts): tạo, sửa, xóa, phân loại (Top, New, Old).
- Bình luận (Comments): hỗ trợ bình luận lồng nhau (nested comments) theo bài viết.
- Bình chọn (Votes): hỗ trợ upvote/downvote với cập nhật nguyên tử.
- Thống kê (Statistics): thu thập số liệu cơ bản như số bài, số bình luận, lượt vote.
- Hỗ trợ nạp dữ liệu thử nghiệm từ file CSV và script sinh dữ liệu giả.

---

## 3. CÔNG NGHỆ SỬ DỤNG 🔧
- Node.js (CommonJS)
- Express.js
- MongoDB với Mongoose
- dotenv (quản lý biến môi trường)
- csv-parser (xử lý CSV)
- @faker-js/faker (tạo dữ liệu giả)

**Cấu trúc thư mục chính:**
- `src/config` — cấu hình DB, khởi tạo schema
- `src/controllers` — xử lý logic cho các route
- `src/models` — định nghĩa các schema Mongoose
- `src/routes` — định nghĩa API endpoints
- `data/` — chứa file CSV và script sinh dữ liệu mẫu (trước đây là `Admin/`)
- `test/` — chứa file kiểm thử

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
- Thư mục `data/` chứa các file CSV và script (ví dụ `gen_fake_data.js`) để sinh và nạp dữ liệu mẫu.

---

## Bảo mật & Lưu ý 🔐
- **Không** commit file `.env` chứa secret vào kho mã nguồn.
- Sử dụng `.env.example` để chia sẻ cấu trúc biến môi trường.

---
