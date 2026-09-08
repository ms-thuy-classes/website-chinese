export function shuffleArray(array) {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function shuffleMCQOptions(question) {
  if (question.type !== 'mcq') return question
  
  const options = question.options.map((option, index) => ({
    text: option,
    isCorrect: index === question.answer
  }))
  
  const shuffled = shuffleArray(options)
  const correctIndex = shuffled.findIndex(o => o.isCorrect)
  
  return {
    ...question,
    options: shuffled.map(o => o.text),
    answer: correctIndex,
    originalOrder: options.map(o => o.text)
  }
}
