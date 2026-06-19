import React from 'react'

function PostCard({ thought, index, setThought }) {

  const badgeClass = `etm-badge etm-badge--${thought.status}`

  return (  
    <div
      className="etm-card"
      style={{ '--etm-card-tilt': `${index % 2 === 0 ? -1.2 : 0.8}deg` }}
    >
      <div className="etm-card__footer" style={{ borderTop: 'none', paddingTop: 0, marginBottom: 'var(--space-sm)' }}>
        <span className="etm-meta">
          @{thought.author?.username} · {thought.category} · {thought.createdAt}
        </span>
        <span className={badgeClass}>{thought.status}</span>
      </div>

      <h3 className="etm-card__title">{thought.title}</h3>
      <p className="etm-card__content">{thought.content}</p>

      <div className="etm-card__footer">
        <button
          className="etm-btn etm-btn--ghost"
          style={{ borderColor: 'rgba(42,26,16,0.15)', color: 'var(--etm-danger)' }}
          onClick={() => setThought(prev => ({...prev, status: 'rejected'} ))}
        >
          Reject
        </button>
        <button
          className="etm-btn etm-btn--primary"
        >
          Accept
        </button>
      </div>
    </div>
  )
}

export default PostCard