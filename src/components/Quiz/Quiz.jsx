import { useState, useEffect } from 'react'
import { shuffleArray, shuffleMCQOptions } from '../../utils/shuffle'
import QuestionCard from './QuestionCard'
import ProgressBar from '../ProgressBar/ProgressBar'
import './Quiz.css'

function Quiz({ questions, onComplete, title = 'Bài kiểm tra' }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showResults, setShowResults] = useState(false)
  const [shuffledQuestions, setShuffledQuestions] = useState([])

  useEffect(() => {
    const shuffled = questions.map(q => {
      if (q.type === 'mcq') {
        return shuffleMCQOptions(q)
      }
      return q
    })
    setShuffledQuestions(shuffleArray(shuffled))
  }, [questions])

  const currentQuestion = shuffledQuestions[currentIndex]

  const handleAnswer = (answer) => {
    setAnswers({
      ...answers,
      [currentQuestion.id]: answer
    })
  }

  const handleNext = () => {
    if (currentIndex < shuffledQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setShowResults(true)
      if (onComplete) {
        const correct = shuffledQuestions.filter(q => {
          const userAnswer = answers[q.id]
          return checkAnswer(q, userAnswer)
        }).length
        
        onComplete({
          correct,
          total: shuffledQuestions.length,
          answers
        })
      }
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const checkAnswer = (question, userAnswer) => {
    if (!userAnswer) return false

    switch (question.type) {
      case 'mcq':
        return userAnswer === question.answer
      
      case 'fill':
      case 'translation':
        const acceptable = question.acceptableAnswers || [question.answer]
        return acceptable.includes(userAnswer.trim())
      
      case 'ordering':
        return JSON.stringify(userAnswer) === JSON.stringify(question.answer)
      
      case 'matching':
        return JSON.stringify(userAnswer) === JSON.stringify(question.answers)
      
      case 'word-bank':
        return JSON.stringify(userAnswer) === JSON.stringify(question.answer)
      
      default:
        return false
    }
  }

  if (shuffledQuestions.length === 0) {
    return <div className="quiz-loading">Đang tải câu hỏi...</div>
  }

  if (showResults) {
    return (
      <QuizResults
        questions={shuffledQuestions}
        answers={answers}
        checkAnswer={checkAnswer}
      />
    )
  }

  return (
    <div className="quiz">
      <div className="quiz-header">
        <h3>{title}</h3>
        <ProgressBar 
          current={currentIndex + 1} 
          total={shuffledQuestions.length} 
        />
      </div>

      <QuestionCard
        question={currentQuestion}
        answer={answers[currentQuestion.id]}
        onAnswer={handleAnswer}
      />

      <div className="quiz-navigation">
        <button
          className="btn btn-secondary"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          ← Câu trước
        </button>

        <span className="question-counter">
          Câu {currentIndex + 1} / {shuffledQuestions.length}
        </span>

        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!answers[currentQuestion.id]}
        >
          {currentIndex === shuffledQuestions.length - 1 ? 'Hoàn thành' : 'Câu tiếp theo →'}
        </button>
      </div>
    </div>
  )
}

function QuizResults({ questions, answers, checkAnswer }) {
  const correct = questions.filter(q => checkAnswer(q, answers[q.id])).length
  const total = questions.length
  const score = Math.round((correct / total) * 10) / 10

  return (
    <div className="quiz-results">
      <div className="results-header">
        <h3>Kết quả</h3>
        <div className="score-display">
          <div className="score-value">{score} / 10</div>
          <div className="score-detail">{correct} / {total} câu đúng</div>
        </div>
      </div>

      <div className="results-list">
        {questions.map((question, index) => {
          const isCorrect = checkAnswer(question, answers[question.id])
          
          return (
            <div key={question.id} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
              <div className="result-question">
                <strong>Câu {index + 1}:</strong>
                {question.question || question.prompt || 'Câu hỏi'}
              </div>
              
              <div className="result-answer">
                <span className="label">Đáp án của bạn:</span>
                <span>{formatAnswer(question, answers[question.id])}</span>
              </div>
              
              {!isCorrect && (
                <div className="result-correct">
                  <span className="label">Đáp án đúng:</span>
                  <span>{formatAnswer(question, question.answer)}</span>
                </div>
              )}
              
              {question.explanation && (
                <div className="result-explanation">
                  <strong>Giải thích:</strong> {question.explanation}
                </div>
              )}
              
              {question.meaning && (
                <div className="result-meaning">
                  <strong>Nghĩa:</strong> {question.meaning}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function formatAnswer(question, answer) {
  if (!answer) return 'Chưa trả lời'
  
  if (question.type === 'mcq') {
    return question.options[answer]
  }
  
  if (Array.isArray(answer)) {
    return answer.join(' ')
  }
  
  if (typeof answer === 'object') {
    return Object.values(answer).join(', ')
  }
  
  return answer
}

export default Quiz
