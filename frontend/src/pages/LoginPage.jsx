import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import api from '../api/axios'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {login} = useAuth()

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    
    setLoading(true)

    if (!formData.email.trim() || !formData.password.trim()) {
      return toast.error("All fields are required")
    }

      if (!EMAIL_REGEX.test(formData.email.trim())){
      toast.error("Invalid credentials")
      return
    }

    if (formData.password.length < 8) {
      toast.error("Invalid credentials")
      return
    }

    try {
      const res = await api.post("/auth/login", formData)
      login(res.data.user, res.data.accessToken)
      toast.success(`Welcome user`, { duration: 3000 })
      navigate("/home")
    } catch (error) {
      if (error.response?.status === 429) {
        return toast.error("Slow down you are making many requests")
      } else if (error.response?.status === 403) {
        toast.error("You're account has been banned")
      } else {
        console.error("Failed to log in", error)
        toast.error(error.response?.data?.message || 'Failed to login')
        setError(error.response?.data?.message || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='etm-auth'>

      {/* Left — Brand / Info panel */}
      <div className='etm-board etm-auth__brand'>
        <h1 className="etm-display etm-display--xl">
          Each Thoughts Matter
        </h1>
        <p className="etm-body max-w-sm">
          Pin a thought, anonymously. Read what others are carrying. Every voice gets a spot on the board.
        </p>
        <Link to='/' className='etm-btn--text mt-4'>
          🡰 Back to the Board
        </Link>
      </div>

      {/* Right — Login form */}
      <div className='etm-auth__form-side'>
        <form onSubmit={handleSubmit} className='etm-auth__form'>

          <p className='etm-eyebrow etm-eyebrow--surface'>Welcome back</p>
          <h2 className='etm-display etm-display--md mb-4' style={{ color: 'var(--etm-text-on-light)' }}>
            Log in to your account
          </h2>

          <div className='etm-field'>
            <label className='etm-label etm-label--surface' htmlFor='email'>Email</label>
            <input
              id='email'
              name='email'
              type='email'
              value={formData.email}
              onChange={handleChange}
              placeholder='you@example.com'
              className='etm-input etm-input--surface'
              required
            />
          </div>

          <div className='etm-field'>
            <label className='etm-label etm-label--surface' htmlFor='password'>Password</label>
            <div className='etm-input-group'>
              <input
                id='password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                placeholder='••••••••'
                className='etm-input etm-input--surface'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='etm-input-toggle'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type='submit' className='etm-btn etm-btn--primary w-full justify-center mt-3'>
            Log In
          </button>

          <p className='etm-meta etm-meta--surface text-center mt-4'>
            Don't have an account?{' '}
            <Link to='/register' className='etm-link--surface'>
              Sign up
            </Link>
          </p>

        </form>
      </div>

    </div>
  )
}

export default LoginPage