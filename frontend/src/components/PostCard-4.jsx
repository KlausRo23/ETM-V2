import React, { useRef, useState } from 'react'
import { Heart, MessageCircle, MoreHorizontal } from 'lucide-react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router'

function PostCard4({ thought, index, setThoughts }) {
  const { user } = useAuth()
  const [liking, setLiking] = useState(false)
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [openMenu, setOpenMenu] = useState(false)
  const menuRef = useRef(null)

  const isLiked = thought.likedBy?.some(id => String(id) === String(user?.id))
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  // close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLikeClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (liking || !user) return

    setLiking(true)
    const wasLiked = isLiked
    const prevThought = thought

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
      setThoughts(prev =>
        prev.map(t => (t._id === thought._id ? prevThought : t))
      )
    } finally {
      setLiking(false)
    }
  }

  async function handleDeletePost(e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.delete(`/admin/thought/${thought._id}`)
      setThoughts(prev => prev.filter(t => t._id !== thought._id))
      toast.success("Post deleted")
    } catch (error) {
      console.error("Failed to delete post", error)
      toast.error("Failed to delete post")
    } finally {
      setOpenMenu(false)
    }
  }

  async function handleBanUser(e) {
    e.preventDefault()
    e.stopPropagation()
    try {
      await api.patch(`/admin/ban/${thought.author?._id}`)
      toast.success(`${thought.author?.username} has been banned`)
    } catch (error) {
      console.error("Failed to ban user", error)
      toast.error("Failed to ban user")
    } finally {
      setOpenMenu(false)
    }
  }

  function handleCommentSubmit(e) {
    e.preventDefault()
    console.log('submit comment:', commentText)
    setCommentText('')
  }

  return (
    <Link to={`/thought/${thought._id}`}>
      <div
        className="etm-card"
        style={{ '--etm-card-tilt': `${index % 2 === 0 ? -1.2 : 0.8}deg`, position: 'relative' }}
      >

        {/* Three dot menu — admin only */}
        {isAdmin && (
          <div
            ref={menuRef}
            style={{ position: 'absolute', top: 'var(--space-sm)', right: 'var(--space-sm)' }}
          >
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpenMenu(prev => !prev) }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--etm-text-muted)',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
              }}
            >
              <MoreHorizontal size={18} />
            </button>

            {openMenu && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: '1.8rem',
                background: 'var(--etm-surface)',
                border: '1px solid var(--etm-border)',
                borderRadius: '0.5rem',
                boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                zIndex: 10,
                minWidth: '140px',
                overflow: 'hidden',
              }}>
                <button
                  onClick={handleDeletePost}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.6rem 1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: 'var(--etm-danger)',
                  }}
                >
                  Delete Post
                </button>
                <button
                  onClick={handleBanUser}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '0.6rem 1rem',
                    textAlign: 'left',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: 'var(--etm-danger)',
                  }}
                >
                  Ban User
                </button>
              </div>
            )}
          </div>
        )}

        {/* Card Header */}
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
              disabled={liking}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: isLiked ? 'var(--etm-danger)' : 'rgba(42,26,16,0.6)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Heart size={16} fill={isLiked ? 'var(--etm-danger)' : 'none'} />
              {thought.likedBy?.length ?? 0}
            </button>

            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowCommentInput(prev => !prev) }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                color: 'rgba(42,26,16,0.6)',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
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

export default PostCard4