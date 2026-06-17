import React from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function NavBar() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  async function handleLogout() {
    await logout()
    toast.success('Log out successfully')
    navigate('/')
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ETM
      </Link>

      <div className="navbar-links">
        <Link to="/">Feed</Link>
      </div>

      <div className="profile-menu">
        <div className="profile-icon">
          {/* swap with your icon lib / avatar img if you've got one */}
          <span>{user?.username?.[0]?.toUpperCase() || 'U'}</span>
        </div>

        <div className="profile-dropdown">
          <Link to={`/profile/${user?._id}`} className="dropdown-item">
            Profile
          </Link>
          <Link to="/my-posts" className="dropdown-item">
            Submitted Posts
          </Link>
          <button
            onClick={handleLogout}
            className="dropdown-item logout-btn"
            disabled={loading}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default NavBar