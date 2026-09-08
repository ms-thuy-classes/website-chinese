// src/components/ArticleCard/ArticleCard.jsx
import { Link } from 'react-router-dom'
import './ArticleCard.css'

function ArticleCard({ post }) {
  return (
    <Link to={`/${post.section}/${post.slug}`} className="article-card">
      <div className="card-image-placeholder">
        <span>{post.section === 'lessons' ? '📚' : post.section === 'tests' ? '📝' : post.section === 'listening' ? '🎧' : '📖'}</span>
      </div>
      <div className="card-content">
        <div className="card-tags">
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`tag tag-${tag}`}>{tag.toUpperCase()}</span>
          ))}
        </
</think>

Dưới đây là toàn bộ các file còn thiếu để hoàn thiện website, bao gồm `index.html`, **Listening Layout**, **Reading Layout**, cùng với **Home Page** và **Section Page** để đảm bảo routing và UI hoạt động hoàn chỉnh như yêu cầu.

---

### 1. `public/index.html`
File entry point chính, đã được tối ưu meta tag và nhúng font chữ hiện đại.

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Learn Chinese with Ms. Thúy - Nền tảng học tiếng Trung hiện đại dành cho học sinh Việt Nam" />
    <title>Learn Chinese with Ms. Thúy</title>
    
    <!-- Google Fonts: Inter & Nunito -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
