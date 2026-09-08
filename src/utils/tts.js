let currentUtterance = null
let currentAudio = null

export const tts = {
  speak(text, lang = 'zh-CN', rate = 1) {
    this.stop()
    
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-Speech not supported')
      return
    }
    
    currentUtterance = new SpeechSynthesisUtterance(text)
    currentUtterance.lang = lang
    currentUtterance.rate = rate
    
    const voices = speechSynthesis.getVoices()
    const chineseVoice = voices.find(voice => 
      voice.lang.includes('zh') || voice.lang.includes('cmn')
    )
    
    if (chineseVoice) {
      currentUtterance.voice = chineseVoice
    }
    
    speechSynthesis.speak(currentUtterance)
  },
  
  stop() {
    if (currentUtterance) {
      speechSynthesis.cancel()
      currentUtterance = null
    }
    if (currentAudio) {
      currentAudio.pause()
      currentAudio.currentTime = 0
      currentAudio = null
    }
  },
  
  playAudio(url) {
    this.stop()
    currentAudio = new Audio(url)
    currentAudio.play().catch(err => {
      console.error('Error playing audio:', err)
    })
  },
  
  isPlaying() {
    return speechSynthesis.speaking || (currentAudio && !currentAudio.paused)
  }
}
