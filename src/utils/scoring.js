export function calculateScore(correct, total) {
  if (total === 0) return 0
  return Math.round((correct / total) * 100) / 10
}

export function getScoreMessage(score) {
  if (score >= 8) return { text: 'Xuất sắc!', color: '#4caf50' }
  if (score >= 6.5) return { text: 'Tốt!', color: '#2196f3' }
  if (score >= 5) return { text: 'Tiếp tục luyện tập!', color: '#ff9800' }
  return { text: 'Cần luyện tập thêm!', color: '#f44336' }
}

export function formatResult(correct, total) {
  return {
    score: calculateScore(correct, total),
    correct,
    total,
    percentage: Math.round((correct / total) * 100)
  }
}
