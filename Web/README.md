# BookingHomeStay Web

Project web React (Vite) + TailwindCSS, dùng JavaScript.

## Tính năng

- Trang Home có Navbar (logo + menu)
- Hiển thị danh sách 10 bài post từ API https://jsonplaceholder.typicode.com/posts
- Mỗi post gồm: title (bold), body, nút "Xem chi tiết"
- Click "Xem chi tiết" chuyển route /post/:id, hiển thị chi tiết bài viết
- Giao diện responsive, hiện đại với TailwindCSS

## Cài đặt & chạy

```bash
npm install
npm run dev
```

Sau đó truy cập địa chỉ hiển thị trên terminal (thường là http://localhost:5173).

## Thư viện sử dụng

- React
- Vite
- TailwindCSS
- React Router DOM

## Cấu hình Tailwind

Tailwind đã được cấu hình đầy đủ trong file `tailwind.config.js` và import vào `src/index.css`.
