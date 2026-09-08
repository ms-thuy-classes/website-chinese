import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './SearchBar.css'

function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      return
    }

    const search = async () => {
      try {
        const response = await fetch('/src/data/articles.json')
        const data = await response.json()
        
        const filtered = data.posts.filter(post => {
          const searchStr = query.toLowerCase()
          return (
            post.title.toLowerCase().includes(searchStr) ||
            post.description.toLowerCase().includes(searchStr) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchStr))
          )
        })

        setResults(filtered.slice(0, 5))
        setShowResults(true)
      } catch (error) {
        console.error('Search error:', error)
      }
    }

    const timeoutId = setTimeout(search, 300)
    return () => clearTimeout(timeoutId)
  }, [query])

  const handleResultClick = (post) => {
    navigate(`/${post.section}/${post.slug}`)
    setQuery('')
    setShowResults(false)
  }

  return (
    <div className="search-container">
      <input
        type="text"
        className="search-input"
        placeholder="Tìm kiếm bài học..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length > 0 && setShowResults(true)}
        onBlur={() => setTimeout(() => setShowResults(false), 200)}
      />
      
      {showResults && results.length > 0 && (
        <div className="search-results">
          {results.map(result => (
            <div
              key={result.id}
              className="search-result-item"
              onClick={() => handleResultClick(result)}
            >
              <div className="result-title">{result.title}</div>
              <div className="result-description">{result.description}</div>
              <div className="result-tags">
                {result.tags.map(tag => (
                  <span key={tag} className={`tag tag-${tag}`}>
                    {tag.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
