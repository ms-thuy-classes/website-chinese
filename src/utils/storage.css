const STORAGE_KEY = 'chinese-learning-progress'

export const storage = {
  getProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : {
        studentName: '',
        lessonResults: [],
        testResults: [],
        listeningResults: [],
        readingResults: [],
        vocabularyProgress: [],
        settings: {
          showPinyin: true,
          showTranslation: true
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error)
      return {}
    }
  },

  saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
      return true
    } catch (error) {
      console.error('Error saving progress:', error)
      return false
    }
  },

  saveResult(type, result) {
    const progress = this.getProgress()
    const resultsKey = `${type}Results`
    
    if (!progress[resultsKey]) {
      progress[resultsKey] = []
    }
    
    const existingIndex = progress[resultsKey].findIndex(r => r.postId === result.postId)
    
    if (existingIndex >= 0) {
      progress[resultsKey][existingIndex] = result
    } else {
      progress[resultsKey].push(result)
    }
    
    return this.saveProgress(progress)
  },

  getResults(type) {
    const progress = this.getProgress()
    return progress[`${type}Results`] || []
  },

  saveSettings(settings) {
    const progress = this.getProgress()
    progress.settings = { ...progress.settings, ...settings }
    return this.saveProgress(progress)
  },

  clearProgress() {
    localStorage.removeItem(STORAGE_KEY)
  }
}
