// src/layouts/ReadingLayout.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Quiz from '../components/Quiz/Quiz'
import Flashcard from '../components/Flashcard/Flashcard'
import { storage } from '../utils/storage'
import { calculateScore } from '../utils/scoring'
import './ReadingLayout.css'

function ReadingLayout() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const [fontSize, setFontSize] = useState(20) // px
  const [showTranslation, setShowTranslation] = useState(false)
  
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [studentName, setStudentName] = useState('')

  useEffect(() => { loadPost() }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      const articlesRes = await fetch('/src/data/articles.json')
      const articles = await articlesRes.json()
      const article = articles.posts.find(p => p.slug === slug)
      if (!article) throw new Error('Không tìm thấy bài')
      
      const postRes = await fetch(`/src/data/posts/${article.file.split('/').pop()}`)
      setPost(await postRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleQuizComplete = (quizResult) => {
    setResult({ ...quizResult, score: calculateScore(quizResult.correct, quizResult.total) })
    setCompleted(true)
  }

  const handleSaveResult = () => {
    if (!studentName.trim()) return alert('Vui lòng nhập tên học sinh')
    storage.saveResult('reading', {
      postId: post.id, studentName, score: result.score,
      correct: result.correct, total: result.total, date: new Date().toISOString()
    })
    alert('Đã lưu kết quả!')
  }

  if (loading) return <div className="loading-state">Đang tải bài đọc...</div>
  if (!post) return <div className="error-state">Không thể tải bài đọc. <button onClick={loadPost}>Thử lại</button></div>

  if (completed && result) {
    return (
      <div className="reading-layout result-view">
        <div className="result-card">
          <h2>Hoàn thành bài đọc hiểu!</h2>
          <div className="result-input">
            <label>Tên học sinh:</label>
            <input type="text" className="input" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Nhập tên của bạn" />
          </div>
          <div className="result-display">
            <div className="score-big">{result.score} / 10</div>
            <div className="score-detail">{result.correct} / {result.total} câu đúng</div>
          </div>
          <button className="btn btn-primary" onClick={handleSaveResult}>Lưu kết quả</button>
        </div>
      </div>
    )
  }

  const allQuestions = [
    ...(post.questions || []).map(q => ({ ...q, type: 'mcq' })),
    ...(post.summaryFill || []).map(q => ({ ...q, type: 'fill' }))
  ]

  return (
    <div className="reading-layout">
      <div className="reading-header">
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <div className="tags">{post.tags.map(tag => <span key={tag} className={`tag tag-${tag}`}>{tag.toUpperCase()}</span>)}</div>
      </div>

      {post.vocabulary && post.vocabulary.length > 0 && (
        <section className="reading-section">
          <h2>Từ vựng trước khi đọc</h2>
          <div className="vocab-grid">
            {post.vocabulary.map(word => <Flashcard key={word.id} word={word} showPinyin={true} />)
            }
          </div>
        </div>
      )}

      <section className="reading-section">
        <div className="section-header-row">
          <h2>Đoạn văn</h2>
          <div className="reading-controls">
            <div className="font-size-control">
              <span>Cỡ chữ:</span>
              <button onClick={() => setFontSize(Math.max(16, fontSize - 2))} className="control-btn">A-</button>
              <span className="font-size-value">{fontSize}px</span>
              <button onClick={() => setFontSize(Math.min(32, fontSize + 2))} className="control-btn">A+</button>
            </div>
            <button className="btn btn-secondary" onClick={() => setShowTranslation(!showTranslation)}>
              {showTranslation ? 'Ẩn dịch nghĩa' : 'Hiện dịch nghĩa'}
            </button>
          </div>
        </div>
        
        <div className="passage-container">
          <p className="chinese-passage" style={{ fontSize: `${fontSize}px` }}>
            {post.passage}
          </p>
          {showTranslation && (
            <div className="translation-box">
              <h4>Bản dịch tiếng Việt:</h4>
              <p>{post.translation}</p>
            </div>
          )}
        </div>
      </section>

      {allQuestions.length > 0 && (
        <section className="reading-section">
          <h2>Câu hỏi đọc hiểu</h2>
          <Quiz questions={allQuestions} onComplete={handleQuizComplete} title="Bài tập" />
        </section>
      )}
    </div>
  )
}

export default ReadingLayout
