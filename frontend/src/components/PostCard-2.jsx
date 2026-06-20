import React, { useEffect, useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'

function PostCard2({ thought, index, setThoughts }) {
  // TODO(Red): replace with real liked-state check (e.g. thought.likedBy.includes(currentUserId))
  const [isLiked, setIsLiked] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')

  function handleLikeClick() {
    setIsLiked((prev) => !prev)
    // TODO(Red): fire your like/unlike API call here
  }

  function handleCommentSubmit(e) {
    e.preventDefault()
    // TODO(Red): fire your create-comment API call here, then clear input + refresh comments
    console.log('submit comment:', commentText)
    setCommentText('')
  }

  return (
    <div
      className="etm-card"
      style={{ '--etm-card-tilt': `${index % 2 === 0 ? -1.2 : 0.8}deg` }}
    >
      <div
        className="etm-card__footer"
        style={{ borderTop: 'none', paddingTop: 0, marginBottom: 'var(--space-sm)' }}
      >
        <span className="etm-meta">
          {thought.author?.username} · {thought.createdAt}
        </span>
      </div>

      <h3 className="etm-card__title">{thought.title}</h3>
      <p className="etm-card__content">{thought.content}</p>

      <div className="etm-card__footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button
            onClick={handleLikeClick}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: isLiked ? 'var(--etm-danger)' : 'rgba(42,26,16,0.6)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <Heart size={16} fill={isLiked ? 'var(--etm-danger)' : 'none'} />
            {/* TODO(Red): thought.likedBy?.length ?? 0 */}
            {thought.likedBy?.length ?? 0}
          </button>

          <button
            onClick={() => setShowCommentInput((prev) => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.3rem',
              color: 'rgba(42,26,16,0.6)',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            <MessageCircle size={16} />
            {/* TODO(Red): thought.comments?.length ?? 0 */}
            {thought.comments?.length ?? 0}
          </button>
        </div>
      </div>

      {showCommentInput && (
        <form
          onSubmit={handleCommentSubmit}
          style={{
            display: 'flex',
            gap: 'var(--space-xs)',
            marginTop: 'var(--space-sm)',
            paddingTop: 'var(--space-sm)',
            borderTop: '1px dashed rgba(42,26,16,0.15)',
          }}
        >
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
            className="etm-input etm-input--surface"
            style={{ flex: 1 }}
            autoFocus
          />
          <button type="submit" className="etm-btn etm-btn--primary">
            Post
          </button>
        </form>
      )}
    </div>
  )
}

export default PostCard2