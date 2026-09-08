import './ProgressBar.css'

function ProgressBar({ current, total, showText = true }) {
  const percentage = (current / total) * 100

  return (
    <div className="progress-container">
      {showText && (
        <div className="progress-text">
          {current} / {total}
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
