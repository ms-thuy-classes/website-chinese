import { Routes, Route } from 'react-router-dom'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import SectionPage from './pages/SectionPage'
import PostPage from './pages/PostPage'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:section" element={<SectionPage />} />
          <Route path="/:section/:slug" element={<PostPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
