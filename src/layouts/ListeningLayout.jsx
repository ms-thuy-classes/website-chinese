// src/layouts/ListeningLayout.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Quiz from '../components/Quiz/Quiz'
import Flashcard from '../components/Flashcard/Flashcard'
import { storage } from '../utils/storage'
import { calculateScore } from '../utils/scoring'
import './ListeningLayout.css'

function ListeningLayout() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showTranscript, setShowTranscript] = useState(true)
  const [playbackRate, setPlaybackRate] = useState(1)
  const audioRef = useRef(null)
  
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

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed)
    if (audioRef.current) audioRef.current.playbackRate = speed
  }

  const handleQuizComplete = (quizResult) => {
    setResult({ ...quizResult, score: calculateScore(quizResult.correct, quizResult.total) })
    setCompleted(true)
  }

  const handleSaveResult = () => {
    if (!studentName.trim()) return alert('Vui lòng nhập tên học sinh')
    storage.saveResult('listening', {
      postId: post.id, studentName, score: result.score,
      correct: result.correct, total: result.total, date: new Date().toISOString()
    })
    alert('Đã lưu kết quả!')
  }

  if (loading) return <div className="loading-state">Đang tải bài nghe...</div>
  if (!post) return <div className="error-state">Không thể tải bài nghe. <button onClick={loadPost}>Thử lại</button></div>

  if (completed && result) {
    return (
      <div className="listening-layout result-view">
        <div className="result-card">
          <h2>Hoàn thành bài nghe!</h2>
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
    ...(post.fillBlank || []).map(q => ({ ...q, type: 'fill' })),
    ...(post.questions || []).map(q => ({ ...q, type: 'mcq' }))
  ]

  return (
    <div className="listening-layout">
      {/* Sticky Audio Player */}
      <div className="sticky-audio-player">
        <div className="audio-info">
          <span className="audio-title">🎵 {post.title}</span>
        </div>
        <audio ref={audioRef} src={post.audioUrl} controls className="native-audio" />
        <div className="speed-controls">
          <span>Tốc độ:</span>
          {[0.75, 1, 1.25].map(speed => (
            <button
              key={speed}
              className={`speed-btn ${playbackRate === speed ? 'active' : ''}`}
              onClick={() => handleSpeedChange(speed)}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>

      <div className="listening-header">
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <div className="tags">{post.tags.map(tag => <span key={tag} className={`tag tag-${tag}`}>{tag.toUpperCase()}</span>)}</div>
      </div>

      {post.vocabulary && post.vocabulary.length > 0 && (
        <section className="listening-section">
          <h2>Từ vựng trong bài</h2>
          <div className="vocab-grid">
            {post.vocabulary.map(word => <Flashcard key={word.id} word={word} showPinyin={true} />)}
          </div>
        </section>
      )}

      <section className="listening-section">
        <div className="section-header-row">
          <h2>Transcript (Nội dung bài nghe)</h2>
          <button className="btn btn-secondary" onClick={() => setShowTranscript(!showTranscript)}>
            {showTranscript ? 'Ẩn transcript' : 'Hiện transcript'}
          </button>
        </div>
        {showTranscript && (
          <div className="transcript-box">
            <p className="chinese-text transcript-text">{post.transcript}</p>
          </div>
        )}
      </section>

      {allQuestions.length > 0 && (
        <section className="listening-section">
          <h2>Bài tập nghe hiểu</h2>
          <Quiz questions={allQuestions} onComplete={handleQuizComplete} title="Câu hỏi" />
        </section>
      )}
    </div>
  )
}

export default ListeningLayout
