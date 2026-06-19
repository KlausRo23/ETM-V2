import React, { useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

function PostCard({ thought, index, setThoughts }) {
  const [updating, setUpdating] = useState(false)

  const badgeClass = `etm-badge etm-badge--${thought.isApprove}`

  async function handleStatusChange(action) {
    setUpdating(true)
    try {
      const res = await api.patch(`/admin/${action}/${thought._id}`)
      const newStatus = action === 'approve' ? 'approved' : 'rejected'

      setThoughts(prev =>
        prev.map(t =>
          t._id === thought._id ? { ...t, isApprove: newStatus } : t
        )
      )

      toast.success(res.data?.message || `Post ${newStatus}`)
    } catch (error) {
      console.error(`Failed to ${action} post`, error)
      toast.error(error.response?.data?.message || `Failed to ${action} post`)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div
      className="etm-card"
      style={{ '--etm-card-tilt': `${index % 2 === 0 ? -1.2 : 0.8}deg` }}
    >
      <div className="etm-card__footer" style={{ borderTop: 'none', paddingTop: 0, marginBottom: 'var(--space-sm)' }}>
        <span className="etm-meta">
          @{thought.author?.username} · {thought.category} · {thought.createdAt}
        </span>
        <span className={badgeClass}>{thought.isApprove}</span>
      </div>

      <h3 className="etm-card__title">{thought.title}</h3>
      <p className="etm-card__content">{thought.content}</p>

      <div className="etm-card__footer">
        <button
          className="etm-btn etm-btn--ghost"
          style={{ borderColor: 'rgba(42,26,16,0.15)', color: 'var(--etm-danger)' }}
          onClick={() => handleStatusChange('reject')}
          disabled={updating}
        >
          Reject
        </button>
        <button
          className="etm-btn etm-btn--primary"
          onClick={() => handleStatusChange('approve')}
          disabled={updating}
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default PostCard