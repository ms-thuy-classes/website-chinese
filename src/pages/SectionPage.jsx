// src/pages/SectionPage.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ArticleCard from '../components/ArticleCard/ArticleCard'
import './SectionPage.css'

function SectionPage() {
  const { section } = useParams()
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [loading, setLoading] = useState(true)

  const sectionTitles = {
    lessons: 'Bài học',
    tests: 'Bài test',
    listening: 'Luyện tập nghe hiểu',
    reading: 'Luyện tập đọc hiểu'
  }

  const allTags = [
    'hsk-1', 'hsk-2', 'hsk-3', 'hsk-4', 'hsk-5', 'hsk-6',
    'hanyu-1', 'hanyu-2', 'hanyu-3', 'hanyu-4', 'hanyu-5', 'hanyu-6'
  ]

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/src/data/articles.json')
        const data = await response.json()
        const sectionPosts = data.posts.filter(p => p.section === section && p.published)
        setPosts(sectionPosts)
        setFilteredPosts(sectionPosts)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [section])

  useEffect(() => {
    let result = posts

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    if (selectedTags.length > 0) {
      result = result.filter(p => selectedTags.every(tag => p.tags.includes(tag)))
    }

    setFilteredPosts(result)
  }, [searchQuery, selectedTags, posts])

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedTags([])
  }

  if (loading) return <div className="loading-state">Đang tải...</div>

  return (
    <div className="section-page">
      <div className="page-header">
        <h1>{sectionTitles[section] || 'Danh sách bài'}</h1>
        <p>Tìm kiếm và lọc bài học theo nhu của bạn.</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          className="search-input-large"
          placeholder="Tìm kiếm theo tên bài, giáo trình, HSK..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <div className="tags-filter">
          {allTags.map(tag => (
            <button
              key={tag}
              className={`filter-tag ${selectedTags.includes(tag) ? 'active' : ''} tag-${tag}`}
              onClick={() => toggleTag(tag)}
            >
              {tag.toUpperCase()}
            </button>
          ))}
        </div>

        {(searchQuery || selectedTags.length > 0) && (
          <button className="btn btn-secondary clear-btn" onClick={clearFilters}>
            ✕ Xóa bộ lọc
          </button>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h3>Không tìm thấy bài học phù hợp.</h3>
          <p>Hãy thử thay đổi từ khóa hoặc xóa bộ lọc.</p>
          <button className="btn btn-primary" onClick={clearFilters}>Xóa bộ lọc</button>
        </div>
      ) : (
        <div className="articles-grid">
          {filteredPosts.map(post => <ArticleCard key={post.id} post={post} />)}
        </div>
      )}
    </div>
  )
}

export default SectionPage
