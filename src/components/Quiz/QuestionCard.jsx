import { useState } from 'react'
import './QuestionCard.css'

function QuestionCard({ question, answer, onAnswer }) {
  switch (question.type) {
    case 'mcq':
      return <MCQQuestion question={question} answer={answer} onAnswer={onAnswer} />
    case 'fill':
      return <FillQuestion question={question} answer={answer} onAnswer={onAnswer} />
    case 'ordering':
      return <OrderingQuestion question={question} answer={answer} onAnswer={onAnswer} />
    case 'translation':
      return <TranslationQuestion question={question} answer={answer} onAnswer={onAnswer} />
    case 'matching':
      return <MatchingQuestion question={question} answer={answer} onAnswer={onAnswer} />
    case 'word-bank':
      return <WordBankQuestion question={question} answer={answer} onAnswer={onAnswer} />
    default:
      return <div>Loại câu hỏi không được hỗ trợ</div>
  }
}

function MCQQuestion({ question, answer, onAnswer }) {
  return (
    <div className="question-card">
      <div className="question-text chinese-text">
        {question.question}
      </div>
      
      <div className="options">
        {question.options.map((option, index) => (
          <div
            key={index}
            className={`quiz-option ${answer === index ? 'selected' : ''}`}
            onClick={() => onAnswer(index)}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}.</span>
            <span className="option-text">{option}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FillQuestion({ question, answer, onAnswer }) {
  return (
    <div className="question-card">
      <div className="question-text chinese-text">
        {question.question.split('___').map((part, index, arr) => (
          <span key={index}>
            {part}
            {index < arr.length - 1 && (
              <input
                type="text"
                className="fill-input"
                value={answer || ''}
                onChange={(e) => onAnswer(e.target.value)}
                placeholder="___"
              />
            )}
          </span>
        ))}
      </div>
    </div>
  )
}

function OrderingQuestion({ question, answer = [], onAnswer }) {
  const [selected, setSelected] = useState(answer)

  const handleTokenClick = (token) => {
    if (selected.includes(token)) {
      const newSelected = selected.filter(t => t !== token)
      setSelected(newSelected)
      onAnswer(newSelected)
    } else {
      const newSelected = [...selected, token]
      setSelected(newSelected)
      onAnswer(newSelected)
    }
  }

  return (
    <div className="question-card">
      <div className="ordering-tokens">
        {question.tokens.map((token, index) => (
          <div
            key={index}
            className={`ordering-token ${selected.includes(token) ? 'selected' : ''}`}
            onClick={() => handleTokenClick(token)}
          >
            {token}
          </div>
        ))}
      </div>
      
      <div className="ordering-result">
        {selected.map((token, index) => (
          <div key={index} className="selected-token">
            {token}
          </div>
        ))}
      </div>
    </div>
  )
}

function TranslationQuestion({ question, answer, onAnswer }) {
  const [showHint, setShowHint] = useState(false)

  return (
    <div className="question-card">
      <div className="question-prompt">
        <strong>Dịch sang tiếng Trung:</strong>
        <div className="prompt-text">{question.prompt}</div>
      </div>
      
      <textarea
        className="translation-input"
        value={answer || ''}
        onChange={(e) => onAnswer(e.target.value)}
        placeholder="Nhập câu trả lời của bạn..."
        rows={3}
      />
      
      {question.hints && (
        <div className="hint-section">
          <button
            className="btn btn-secondary"
            onClick={() => setShowHint(!showHint)}
          >
            {showHint ? 'Ẩn gợi ý' : 'Hiện gợi ý'}
          </button>
          
          {showHint && (
            <div className="hints">
              {question.hints.map((hint, index) => (
                <div key={index} className="hint-item">{hint}</div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function MatchingQuestion({ question, answer = {}, onAnswer }) {
  const handleMatch = (leftId, rightId) => {
    onAnswer({
      ...answer,
      [leftId]: rightId
    })
  }

  return (
    <div className="question-card">
      <div className="matching-container">
        <div className="matching-left">
          {question.left.map((item) => (
            <div key={item.id} className="matching-item">
              <div className="item-label">{item.id}.</div>
              <div className="item-text chinese-text">{item.text}</div>
              <select
                className="matching-select"
                value={answer[item.id] || ''}
                onChange={(e) => handleMatch(item.id, e.target.value)}
              >
                <option value="">Chọn đáp án</option>
                {question.right.map((right) => (
                  <option key={right.id} value={right.id}>
                    {right.id}. {right.text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WordBankQuestion({ question, answer = [], onAnswer }) {
  const [blanks, setBlanks] = useState(answer)

  const handleWordClick = (word) => {
    if (blanks.includes(word)) return
    
    const newBlanks = [...blanks, word]
    setBlanks(newBlanks)
    onAnswer(newBlanks)
  }

  const handleRemoveWord = (index) => {
    const newBlanks = blanks.filter((_, i) => i !== index)
    setBlanks(newBlanks)
    onAnswer(newBlanks)
  }

  const usedWords = new Set(blanks)

  return (
    <div className="question-card">
      <div className="word-bank-sentence chinese-text">
        {question.sentence.split('___').map((part, index, arr) => (
          <span key={index}>
            {part}
            {index < arr.length - 1 && (
              <span className={`blank ${blanks[index] ? 'filled' : ''}`}>
                {blanks[index] && (
                  <>
                    {blanks[index]}
                    <span
                      className="blank-remove"
                      onClick={() => handleRemoveWord(index)}
                    >
                      ×
                    </span>
                  </>
                )}
              </span>
            )}
          </span>
        ))}
      </div>
      
      <div className="word-bank">
        {question.words.map((word, index) => (
          <div
            key={index}
            className={`word-chip chinese-text ${usedWords.has(word) ? 'used' : ''}`}
            onClick={() => handleWordClick(word)}
          >
            {word}
          </div>
        ))}
      </div>
    </div>
  )
}

export default QuestionCard
