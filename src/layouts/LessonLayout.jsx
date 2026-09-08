import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Flashcard from '../components/Flashcard/Flashcard'
import Quiz from '../components/Quiz/Quiz'
import { storage } from '../utils/storage'
import { calculateScore } from '../utils/scoring'
import './LessonLayout.css'

function LessonLayout() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPinyin, setShowPinyin] = useState(true)
  const [currentVocabIndex, setCurrentVocabIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [studentName, setStudentName] = useState('')
  const [result, setResult] = useState(null)

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
        throw new Error('Không tìm thấy bài học')
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

  const handleQuizComplete = (quizResult) => {
    const score = calculateScore(quizResult.correct, quizResult.total)
    setResult({
      ...quizResult,
      score
    })
    setCompleted(true)
  }

  const handleSaveResult = () => {
    if (!studentName.trim()) {
      alert('Vui lòng nhập tên học sinh')
      return
    }

    storage.saveResult('lesson', {
      postId: post.id,
      studentName,
      score: result.score,
      correct: result.correct,
      total: result.total,
      date: new Date().toISOString()
    })

    alert('Đã lưu kết quả!')
  }

  if (loading) {
    return (
      <div className="lesson-layout">
        <div className="skeleton" style={{ height: '40px', width: '60%' }}></div>
        <div className="skeleton" style={{ height: '300px', marginTop: '2rem' }}></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="lesson-layout">
        <div className="error-state">
          <h2>Không thể tải bài học</h2>
          <button className="btn btn-primary" onClick={loadPost}>
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (completed && result) {
    return (
      <div className="lesson-layout">
        <div className="result-card">
          <h2>Hoàn thành bài học!</h2>
          
          <div className="result-input">
            <label>Tên học sinh:</label>
            <input
              type="text"
              className="input"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Nhập tên của bạn"
            />
          </div>

          <div className="result-display">
            <div className="score-big">{result.score} / 10</div>
            <div className="score-detail">
              {result.correct} / {result.total} câu đúng
            </div>
          </div>

          <button className="btn btn-primary" onClick={handleSaveResult}>
            Lưu kết quả
          </button>
        </div>
      </div>
    )
  }

  const allQuestions = []

  if (post.deepPractice) {
    if (post.deepPractice.matching) {
      allQuestions.push(...post.deepPractice.matching.map(q => ({ ...q, type: 'matching' })))
    }
    if (post.deepPractice.fillBlank) {
      allQuestions.push(...post.deepPractice.fillBlank.map(q => ({ ...q, type: 'fill' })))
    }
    if (post.deepPractice.wordBank) {
      allQuestions.push(...post.deepPractice.wordBank.map(q => ({ ...q, type: 'word-bank' })))
    }
    if (post.deepPractice.ordering) {
      allQuestions.push(...post.deepPractice.ordering.map(q => ({ ...q, type: 'ordering' })))
    }
    if (post.deepPractice.translation) {
      allQuestions.push(...post.deepPractice.translation.map(q => ({ ...q, type: 'translation' })))
    }
  }

  return (
    <div className="lesson-layout">
      <div className="lesson-header">
        <h1>{post.title}</h1>
        <p className="lesson-description">{post.description}</p>
        
        <div className="lesson-tags">
          {post.tags.map(tag => (
            <span key={tag} className={`tag tag-${tag}`}>
              {tag.toUpperCase()}
            </span>
          ))}
        </div>
      </div>

      {post.vocabulary && post.vocabulary.length > 0 && (
        <section className="lesson-section">
          <div className="section-header">
            <h2>Từ vựng</h2>
            <label className="toggle-label">
              <input
                type="checkbox"
                checked={showPinyin}
                onChange={(e) => setShowPinyin(e.target.checked)}
              />
              Hiển thị Pinyin
            </label>
          </div>

          <div className="vocabulary-nav">
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentVocabIndex(Math.max(0, currentVocabIndex - 1))}
              disabled={currentVocabIndex === 0}
            >
              ← Trước
            </button>
            
            <span className="vocab-counter">
              {currentVocabIndex + 1} / {post.vocabulary.length}
            </span>
            
            <button
              className="btn btn-secondary"
              onClick={() => setCurrentVocabIndex(Math.min(post.vocabulary.length - 1, currentVocabIndex + 1))}
              disabled={currentVocabIndex === post.vocabulary.length - 1}
            >
              Tiếp →
            </button>
          </div>

          <Flashcard
            word={post.vocabulary[currentVocabIndex]}
            showPinyin={showPinyin}
          />
        </section>
      )}

      {post.grammar && post.grammar.length > 0 && (
        <section className="lesson-section">
          <h2>Ngữ pháp</h2>
          {post.grammar.map((grammar, index) => (
            <div key={index} className="grammar-item">
              <h3>{grammar.title}</h3>
              <p>{grammar.explanation}</p>
              
              {grammar.structure && (
                <div className="grammar-structure">
                  <strong>Cấu trúc:</strong> {grammar.structure}
                </div>
              )}

              {grammar.points && grammar.points.length > 0 && (
                <ul className="grammar-points">
                  {grammar.points.map((point, i) => (
                    <li key={i}>{point.text}</li>
                  ))}
                </ul>
              )}

              {grammar.examples && grammar.examples.length > 0 && (
                <div className="grammar-examples">
                  <h4>Ví dụ:</h4>
                  {grammar.examples.map((example, i) => (
                    <div key={i} className="example-item">
                      <div className="chinese-text" style={{ fontSize: '1.5rem' }}>
                        {example.sentence}
                      </div>
                      {showPinyin && example.pinyin && (
                        <div className="pinyin">{example.pinyin}</div>
                      )}
                      <div className="vietnamese">{example.meaning}</div>
                    </div>
                  ))}
                </div>
              )}

              {grammar.table && (
                <div className="grammar-table-container">
                  <table className="grammar-table">
                    <thead>
                      <tr>
                        {grammar.table.columns.map((col, i) => (
                          <th key={i}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {grammar.table.rows.map((row, i) => (
                        <tr key={i}>
                          {row.map((cell, j) => (
                            <td key={j}>{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {allQuestions.length > 0 && (
        <section className="lesson-section">
          <h2>Ôn luyện chuyên sâu</h2>
          <Quiz
            questions={allQuestions}
            onComplete={handleQuizComplete}
            title="Ôn luyện"
          />
        </section>
      )}
    </div>
  )
}

export default LessonLayout
