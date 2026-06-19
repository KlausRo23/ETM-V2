import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function ViewPendingPost() {
  const { loading: authLoading, isAuthenticated } = useAuth()

  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
  ]

  const visibleThoughts = Array.isArray(thoughts)
    ? (statusFilter === 'all' ? thoughts : thoughts.filter((t) => t.isApprove === statusFilter))
    : []

  useEffect(() => {
    // wait for AuthContext to finish its /auth/refresh check first
    if (authLoading) return
    // no point hitting an admin endpoint with no session
    if (!isAuthenticated) {
      setLoading(false)
      return
    }

    async function getPendingThought() {
      setLoading(true)
      setError(null)

      try {
        const res = await api.get("/admin/pendings")
        setThoughts(res.data.data || [])
      } catch (err) {
        console.error("Failed to fetch data", err)
        setError("Failed to load submissions.")
        toast.error("Error in fetching")
      } finally {
        setLoading(false)
      }
    }

    getPendingThought()
  }, [authLoading, isAuthenticated])

  return (
    <div className="etm-board etm-board--texture">
      <div className="etm-bg-notes">
        <div className="etm-bg-note etm-bg-note--1">pin it up</div>
        <div className="etm-bg-note etm-bg-note--2">be heard</div>
        <div className="etm-bg-note etm-bg-note--3">anon thoughts</div>
        <div className="etm-bg-note etm-bg-note--4">shared board</div>
        <div className="etm-bg-note etm-bg-note--5">say it</div>
        <div className="etm-bg-note etm-bg-note--6">read it</div>
      </div>

      <div className="etm-board__content etm-container">
        <div style={{ marginBottom: 'var(--space-lg)' }}>
          <p className="etm-eyebrow">Admin · Moderation Queue</p>
          <h1 className="etm-display etm-display--lg" style={{ margin: '0.25rem 0 0.5rem' }}>
            Submitted Posts
          </h1>
          <p className="etm-body" style={{ color: 'var(--etm-text-muted)' }}>
            Review what the community's pinned to the board before it goes live.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-xs)', flexWrap: 'wrap', marginBottom: 'var(--space-lg)' }}>
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className="etm-btn"
              style={
                statusFilter === f.key
                  ? { background: 'var(--etm-accent)', color: 'var(--etm-text-on-light)' }
                  : { background: 'rgba(251,245,236,0.08)', color: 'var(--etm-text-on-dark)', border: '1px solid var(--etm-border)' }
              }
            >
              {f.label}
            </button>
          ))}
        </div>

        {authLoading || loading ? (
          <div className="etm-empty-state">
            <p className="etm-body">Loading submissions...</p>
          </div>
        ) : error ? (
          <div className="etm-empty-state">
            <p className="etm-display etm-display--md">Something went wrong</p>
            <p className="etm-body" style={{ color: 'var(--etm-text-muted)' }}>
              {error}
            </p>
          </div>
        ) : visibleThoughts.length === 0 ? (
          <div className="etm-empty-state">
            <p className="etm-display etm-display--md">Nothing here</p>
            <p className="etm-body" style={{ color: 'var(--etm-text-muted)' }}>
              No posts match this filter yet.
            </p>
          </div>
        ) : (
          <div className="etm-grid">
            {visibleThoughts.map((t, index) => (
              <PostCard
                key={t._id}
                thought={t}
                index={index}
                setThoughts={setThoughts}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ViewPendingPost