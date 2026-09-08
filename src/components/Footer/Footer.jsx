import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Learn Chinese with Ms. Thúy</h3>
            <p>Nền tảng học tiếng Trung hiện đại cho học sinh Việt Nam</p>
          </div>
          
          <div className="footer-links">
            <h4>Liên kết</h4>
            <ul>
              <li><a href="/lessons">Bài học</a></li>
              <li><a href="/tests">Bài test</a></li>
              <li><a href="/listening">Nghe hiểu</a></li>
              <li><a href="/reading">Đọc hiểu</a></li>
            </ul>
          </div>
          
          <div className="footer-info">
            <h4>Thông tin</h4>
            <p>© 2026 Learn Chinese with Ms. Thúy</p>
            <p>Được xây dựng với ❤️ cho học sinh Việt Nam</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
