import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import './Header.css'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Trang chủ' },
    { path: '/lessons', label: 'Bài học' },
    { path: '/tests', label: 'Bài test' },
    { path: '/listening', label: 'Nghe hiểu' },
    { path: '/reading', label: 'Đọc hiểu' }
  ]

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-text">Learn Chinese with Ms. Thúy</span>
        </Link>

        <button 
          className="menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className="menu-icon"></span>
        </button>

        <nav className={`nav ${menuOpen ? 'open' : ''}`}>
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <SearchBar />
        </nav>
      </div>
    </header>
  )
}

export default Header
