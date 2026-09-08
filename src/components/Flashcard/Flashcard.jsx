import { useState } from 'react'
import { tts } from '../../utils/tts'
import './Flashcard.css'

function Flashcard({ word, showPinyin = true }) {
  const [flipped, setFlipped] = useState(false)

  const handleFlip = () => {
    setFlipped(!flipped)
  }

  const handleSpeak = (text, e) => {
    e.stopPropagation()
    tts.speak(text, 'zh-CN', 1)
  }

  return (
    <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
      <div className="flashcard-inner">
        <div className="flashcard-front">
          <div className="chinese-text">{word.hanzi}</div>
          {showPinyin && <div className="pinyin">{word.pinyin}</div>}
          <button 
            className="audio-btn"
            onClick={(e) => handleSpeak(word.hanzi, e)}
            aria-label="Phát âm"
          >
            🔊 Nghe
          </button>
        </div>
        
        <div className="flashcard-back">
          <div className="chinese-text">{word.hanzi}</div>
          {showPinyin && <div className="pinyin">{word.pinyin}</div>}
          <div className="vietnamese">{word.meaning}</div>
          
          {word.example && (
            <div className="example-section">
              <div className="chinese-text" style={{ fontSize: '1.5rem' }}>
                {word.example}
              </div>
              {showPinyin && word.examplePinyin && (
                <div className="pinyin">{word.examplePinyin}</div>
              )}
              <div className="vietnamese">{word.exampleMeaning}</div>
              <button 
                className="audio-btn"
                onClick={(e) => handleSpeak(word.example, e)}
                aria-label="Phát âm câu ví dụ"
              >
                🔊 Nghe câu ví dụ
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Flashcard
