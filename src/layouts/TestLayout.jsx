import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Quiz from '../components/Quiz/Quiz'
import Timer from '../components/Timer/Timer'
import { storage } from '../utils/storage'
import { calculateScore } from '../utils/scoring'
import './TestLayout.css'

function TestLayout() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [started, setStarted] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [result, setResult] = useState(null)
  const [studentName, setStudentName] = useState('')
  const [timeSpent, setTimeSpent] = useState(0)

  useEffect(() => {
    loadPost()
  }, [slug])

  const loadPost = async () => {
    try {
      setLoading(true)
      
      const articlesResponse = await fetch('/src/data/articles.json')
      const articles = await articlesResponse.json()
      
      const article = articles.posts.find(p => p.slug === slug)
      
      if (!article) {
        throw new Error('Không tìm thấy bài test')
      }
      
      const postResponse = await fetch(`/src/data/posts/${article.file.split('/').pop()}`)
      const postData = await postResponse.json()
      
      setPost(postData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading post:', error)
      setLoading(false)
    }
  }

  const handleStart = () => {
    if (!studentName.trim()) {
      alert('Vui lòng nhập tên học sinh')
      return
    }
    setStarted(true)
  }

  const handleComplete = (quizResult) => {
    const score = calculateScore(quizResult.correct, quizResult.total)
    setResult({
      ...quizResult,
      score,
      timeSpent
    })
    setCompleted(true)
  }

  const handleTimeUp = () => {
    alert('Hết giờ!')
    setCompleted(true)
  }

  const handleSaveResult = () => {
    storage.saveResult('test', {
      postId: post.id,
      studentName,
      score: result.score,
      correct: result.correct,
      total: result.total,
      timeSpent: result.timeSpent,
      date: new Date().toISOString()
    })

    alert('Đã lưu kết quả!')
  }

  if (loading) {
    return <div className="test-layout">Đang tải...</div>
  }

  if (!post) {
    return (
      <div className="test-layout">
        <div className="error-state">
          <h2>Không thể tải bài test</h2>
          <button className="btn btn-primary" onClick={loadPost}>
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="test-layout">
        <div className="test-intro">
          <h1>{post.title}</h1>
          <p className="test-description">{post.description}</p>
          
          <div className="test-info">
            <div className="info-item">
              <span className="info-label">Số câu hỏi:</span>
              <span className="info-value">{post.questions.length}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thời gian:</span>
              <span className="info-value">
                {Math.floor(post.timeLimit / 60)} phút
              </span>
            </div>
          </div>

          <div className="student-input">
            <label>Tên học sinh:</label>
            <input
              type="text"
              className="input"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nhập tên của bạn"
            />
          </div>

          <button className="btn btn-primary btn-large" onClick={handleStart}>
            Bắt đầu làm bài
          </button>
        </div>
      </div>
    )
  }

  if (completed && result) {
    return (
      <div className="test-layout">
        <div className="result-card">
          <h2>Kết quả bài test</h2>
          
          <div className="result-display">
            <div className="score-big">{result.score} / 10</div>
            <div className="score-detail">
              {result.correct} / {result.total} câu đúng
            </div>
            <div className="time-spent">
              Thời gian: {Math.floor(result.timeSpent / 60)}:{String(result.timeSpent % 60).padStart(2, '0')}
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSaveResult}>
            Lưu kết quả
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="test-layout">
      <div className="test-header">
        <h1>{post.title}</h1>
        <Timer
          duration={post.timeLimit}
          onTimeUp={handleTimeUp}
          onTick={setTimeSpent}
        />
      </div>

      <Quiz
        questions={post.questions}
        onComplete={handleComplete}
        title={post.title}
      />
    </div>
  )
}

export default TestLayout
