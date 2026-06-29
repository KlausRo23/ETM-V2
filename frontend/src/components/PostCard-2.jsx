import React, { useState } from 'react'
import { Heart, MessageCircle } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

function PostCard2({ thought, index, setThoughts }) {
  const { user } = useAuth()
  const [liking, setLiking] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')

  const isLiked = thought.likedBy?.some(id => String(id) === String(user?.id))

  dayjs.extend(relativeTime)
  
  async function handleLikeClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (liking || !user) return

    setLiking(true)
    const wasLiked = isLiked
    const prevThought = thought // snapshot for revert on failure

    // optimistic update
    setThoughts(prev =>
      prev.map(t => {
        if (t._id !== thought._id) return t
        const likedBy = wasLiked
          ? t.likedBy.filter(id => String(id) !== String(user.id))
          : [...(t.likedBy || []), user.id]
        return { ...t, likedBy }
      })
    )

    try {
      if (wasLiked) {
        await api.delete(`/thought/${thought._id}/like`)
      } else {
        await api.post(`/thought/${thought._id}/like`)
      }
    } catch (error) {
      console.error("Failed to update like", error)
      toast.error("Failed to update like")
      // revert to pre-click state
      setThoughts(prev =>
        prev.map(t => (t._id === thought._id ? prevThought : t))
      )
    } finally {
      setLiking(false)
    }
  }

  function handleCommentSubmit(e) {
    e.preventDefault()
    // TODO(Red): fire your create-comment API call here, then clear input + refresh comments
    console.log('submit comment:', commentText)
    setCommentText('')
  }

  return (
    <Link to={`/thought/${thought._id}`}>
      <div
        className="etm-card"
        style={{ '--etm-card-tilt': `${index % 2 === 0 ? -1.2 : 0.8}deg` }}
      >
        <div
          className="etm-card__footer"
          style={{ borderTop: 'none', paddingTop: 0, marginBottom: 'var(--space-sm)' }}
        >
          <span className="etm-meta" style={{color: 'var(--etm-rust)' }}>
            {thought.author?.username} · {dayjs(thought.createdAt).fromNow()}
          </span>
        </div>

        <h3 className="etm-card__title">{thought.title}</h3>
        <p className="etm-card__content">{thought.content}</p>

        <div className="etm-card__footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <button
              onClick={handleLikeClick}
              disabled={liking}
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
    </Link>
  )
}

export default PostCard2