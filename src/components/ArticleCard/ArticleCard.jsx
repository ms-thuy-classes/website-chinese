// src/components/ArticleCard/ArticleCard.jsx
import { Link } from 'react-router-dom'
import './ArticleCard.css'

function ArticleCard({ post }) {
  return (
    <Link to={`/${post.section}/${post.slug}`} className="article-card">
      <div className="card-image-placeholder">
        <span>{post.section === 'lessons' ? '📚' : post.section === 'tests' ? '📝' : post.section === 'listening' ? '🎧' : '📖'}</span>
      </div>
      <div className="card-content">
        <div className="card-tags">
          {post.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`tag tag-${tag}`}>{tag.toUpperCase()}</span>
          ))}
        </div>
        <h3 className="card-title">{post.title}</h3>
        <p className="card-desc">{post.description}</p>
      </div>
    </Link>
  )
}
export default ArticleCard
