import { useState, useEffect } from 'react'
import './Timer.css'

function Timer({ duration, onTimeUp, onTick }) {
  const [timeLeft, setTimeLeft] = useState(duration)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp && onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 1
        onTick && onTick(duration - newTime)
        return newTime
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, duration, onTimeUp, onTick])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  return (
    <div className="timer">
      <span className="timer-icon">⏱️</span>
      <span className="timer-text">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </span>
    </div>
  )
}

export default Timer
