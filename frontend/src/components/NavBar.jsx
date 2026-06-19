import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

function NavBar() {
  const { user, logout, loading } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const closeTimer = useRef(null)

  function openDropdown() {
    clearTimeout(closeTimer.current)
    setDropdownOpen(true)
  }

  function closeDropdown() {
    // small delay so mouse can travel from button → dropdown without it vanishing
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150)
  }

  async function handleLogout() {
    await logout()
    toast.success('Log out successfully')
    navigate('/')
  }

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(107,47,15,0.35)] border-b border-[rgba(251,245,236,0.12)] shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tight text-[#FBF5EC]">ETM</div>
          <div className="hidden md:flex items-center gap-6">
            <div className="h-5 w-12 bg-[rgba(251,245,236,0.15)] rounded animate-pulse"></div>
            <div className="h-9 w-28 bg-[rgba(251,245,236,0.15)] rounded-full animate-pulse"></div>
            <div className="w-10 h-10 rounded-full bg-[rgba(251,245,236,0.15)] animate-pulse border border-[rgba(251,245,236,0.2)]"></div>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[rgba(107,47,15,0.35)] border-b border-[rgba(251,245,236,0.12)] shadow-[0_4px_14px_rgba(0,0,0,0.2)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">

        <Link to="/" className="text-2xl font-bold tracking-tight text-[#FBF5EC] hover:text-[#C9772E] transition-colors duration-300">
          ETM
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className="text-[#FBF5EC] hover:text-[#C9772E] text-sm font-medium transition-colors duration-300 relative group"
          >
            Feed
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9772E] group-hover:w-full transition-all duration-300"></span>
          </Link>

          {(user?.role === 'admin' || user?.role === 'superadmin') && (
            <Link
              to="/admin/submitted-posts"
              className="text-[#C9A45F] hover:text-[#FFD700] text-sm font-medium transition-colors duration-300 relative group"
            >
              Submitted Posts
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD700] group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}

          {user?.role === 'superadmin' && (
            <Link
              to="/admin/activity"
              className="text-[#FFD700] hover:text-[#FFA500] text-sm font-medium transition-colors duration-300 relative group"
            >
              Admin Activity
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFA500] group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}

          <Link
            to="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C9772E] text-[#FBF5EC] text-sm font-semibold hover:bg-[#DB8A3F] hover:shadow-lg hover:shadow-[#C9772E]/30 transition-all duration-300"
          >
            <span className="text-base leading-none">+</span>
            Create Post
          </Link>

          {/* Profile dropdown — controlled by React state + close delay */}
          <div
            className="relative"
            onMouseEnter={openDropdown}
            onMouseLeave={closeDropdown}
          >
            <button className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9772E] to-[#A0522D] flex items-center justify-center text-sm font-semibold text-[#FBF5EC] hover:shadow-lg hover:shadow-[#C9772E]/40 transition-all duration-300 border border-[#C9772E]/40">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full pt-2 z-10 min-w-[160px]">
                <div className="flex flex-col bg-[rgba(245,237,225,0.95)] backdrop-blur-lg rounded-lg shadow-xl border border-[rgba(160,82,45,0.25)] overflow-hidden">
                  <Link
                    to={`/profile/${user?._id}`}
                    className="px-4 py-3 text-sm font-medium text-[#2A1A10] hover:bg-[#C9772E]/15 transition-colors duration-300 border-b border-[rgba(160,82,45,0.12)]"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-3 text-sm font-medium text-left text-[#B23A2E] hover:bg-[#B23A2E]/12 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar