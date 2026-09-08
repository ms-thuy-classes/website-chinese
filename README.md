# 🎓 Learn Chinese with Ms. Thúy

Nền tảng học tiếng Trung hiện đại, data-driven, có thể mở rộng lên hàng trăm bài học.

## ✨ Tính năng chính

### 4 Section lớn
- **Bài học**: Từ vựng (flashcard), ngữ pháp, luyện tập chuyên sâu
- **Bài test**: Quiz với timer, shuffle câu hỏi
- **Nghe hiểu**: Audio player, transcript, fill-in-the-blank
- **Đọc hiểu**: Văn bản tiếng Trung, câu hỏi đọc hiểu

### Kiến trúc Data-Driven
- Metadata trong `articles.json`
- Content riêng trong từng file JSON
- Thêm bài mới chỉ cần tạo JSON + cập nhật metadata
- Không cần sửa code khi thêm bài

### Tính năng học tập
- Flashcard với flip animation mượt mà
- Text-to-Speech tự nhiên
- Toggle hiển thị Pinyin/Translation
- 6 loại bài tập: MCQ, Fill, Ordering, Translation, Matching, Word Bank
- Quiz engine reusable
- Timer cho bài test
- Shuffle câu hỏi và đáp án
- Progress tracking với localStorage
- Score system (điểm 10)

### UI/UX
- Pastel gradient design
- Glassmorphism nhẹ
- Responsive hoàn toàn (320px - 1440px)
- Accessibility (semantic HTML, ARIA)
- Loading states & Error handling
- Smooth animations

## 🚀 Cài đặt và chạy

### 1. Clone và cài đặt dependencies

```bash
cd learn-chinese
npm install
