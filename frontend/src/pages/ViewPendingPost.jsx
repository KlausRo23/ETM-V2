import React, { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import toast from 'react-hot-toast'
import api from '../api/axios'

function ViewPendingPost() {
  // TODO(Red): fetch from your admin endpoint, store here
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(false)

  // TODO(Red): wire to your filter query (isApprove: 'pending' | 'approved' | 'rejected')
  const [statusFilter, setStatusFilter] = useState('all')

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Accepted' },
    { key: 'rejected', label: 'Rejected' },
  ]

  // TODO(Red): plug in your real filter logic here
  const visibleThoughts =
    statusFilter === 'all'
      ? thoughts
      : thoughts.filter((t) => t.isApprove === statusFilter)

      useEffect(() => {
        async function getPendingThought() {
          setLoading(true)

          try {
            const res = await api.get("/admin/pendings")
            console.log("Full response:", res.data)
            setThoughts(res.data.data || [])
            console.log(res.data.data || [])
          } catch (error) {
            console.error("Failed to fetch data", error)
            toast.error("Error in fetching")
          } finally {
            setLoading(false)
          }
        }
        getPendingThought()
      }, [])

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

        {/* TODO(Red): wire filter clicks to your actual fetch/filter logic */}
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

        {visibleThoughts.length === 0 ? (
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