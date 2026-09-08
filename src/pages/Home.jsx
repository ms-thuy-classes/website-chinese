// src/pages/Home.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard/ArticleCard'
import './Home.css'

function Home() {
  const [latestPosts, setLatestPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/src/data/articles.json')
        const data = await response.json()
        const published = data.posts
          .filter(p => p.published)
          .sort((a, b) => a.order - b.order)
          .slice(0, 7) // Tối đa 7 bài
        setLatestPosts(published)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const sections = [
    { 
      id: 'lessons', 
      title: 'BÀI HỌC', 
      desc: 'Học từ vựng, ngữ pháp và luyện tập chuyên sâu.', 
      icon: '📚', 
      color: 'var(--pastel-blue)' 
    },
    { 
      id: 'tests', 
      title: 'BÀI TEST', 
      desc: 'Kiểm tra kiến thức qua nhiều dạng bài với tính giờ.', 
      icon: '📝', 
      color: 'var(--pastel-purple)' 
    },
    { 
      id: 'listening', 
      title: 'NGHE HIỂU', 
      desc: 'Luyện nghe với audio, transcript và bài tập điền từ.', 
      icon: '🎧', 
      color: 'var(--pastel-pink)' 
    },
    { 
      id: 'reading', 
      title: 'ĐỌC HIỂU', 
      desc: 'Đọc văn bản tiếng Trung và trả lời câu hỏi.', 
      icon: '📖', 
      color: 'var(--pastel-mint)' 
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Learn Chinese with Ms. Thúy</h1>
          <p className="hero-subtitle">
            Learn Chinese step by step through vocabulary, grammar, listening and reading practice.
          </p>
          <Link to="/lessons" className="btn btn-primary btn-large">
            Bắt đầu học ngay
          </Link>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">你好</div>
          <div className="floating-card card-2">nǐ hǎo</div>
          <div className="floating-card card-3">Xin chào</div>
        </div>
      </section>

      {/* 4 Main Sections */}
      <section className="main-sections">
        {sections.map(section => (
          <Link to={`/${section.id}`} key={section.id} className="section-card" style={{ borderTop: `4px solid ${section.color}` }}>
            <div className="section-icon">{section.icon}</div>
            <h3>{section.title}</h3>
            <p>{section.desc}</p>
            <span className="view-all">Xem tất cả →</span>
          </Link>
        ))}
      </section>

      {/* Latest Articles */}
      <section className="latest-articles">
        <div className="section-header">
          <h2>Bài học mới nhất</h2>
          <Link to="/lessons" className="view-all-link">Xem tất cả →</Link>
        </div>
        
        {loading ? (
          <div className="loading-grid">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-card"></div>)}
          </div>
        ) : (
          <div className="articles-grid">
            {latestPosts.map(post => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
