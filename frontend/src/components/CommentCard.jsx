import React, { useEffect, useRef, useState } from 'react'
import { Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function CommentCard({ thought, refreshKey }) {
  const { user } = useAuth()
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [likingId, setLikingId] = useState(null)
  const menuRefs = useRef({})

  useEffect(() => {
    async function getComments() {
      setLoading(true)
      try {
        const res = await api.get(`/comment/${thought._id}/comments`)
        setComments(res.data || [])
      } catch (error) {
        console.error("Error in fetching comments", error)
        toast.error("Failed to get comments")
      } finally {
        setLoading(false)
      }
    }
    getComments()
  }, [thought._id, refreshKey])

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        openMenuId &&
        menuRefs.current[openMenuId] &&
        !menuRefs.current[openMenuId].contains(e.target)
      ) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openMenuId])

  function formatDate(dateStr) {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  async function handleDelete(commentId) {
    try {
      await api.delete(`/comment/${thought._id}/comments/${commentId}`)
      setComments(prev => prev.filter(c => c._id !== commentId))
      toast.success("Comment deleted")
    } catch (error) {
      console.error("Failed to delete comment", error)
      toast.error("Failed to delete comment")
    } finally {
      setOpenMenuId(null)
    }
  }

  async function handleEdit(commentId) {
    if (!editText.trim()) return
    try {
      const res = await api.put(`/comment/${thought._id}/comments/${commentId}`, { content: editText })
      setComments(prev =>
        prev.map(c => c._id === commentId ? { ...c, content: res.data.data.content } : c)
      )
      toast.success("Comment updated")
    } catch (error) {
      console.error("Failed to edit comment", error)
      toast.error("Failed to edit comment")
    } finally {
      setEditingId(null)
      setEditText('')
      setOpenMenuId(null)
    }
  }

  async function handleLikeComment(e, comment) {
    e.preventDefault()
    e.stopPropagation()
    if (likingId || !user) return

    setLikingId(comment._id)
    const wasLiked = comment.likedBy?.some(id => String(id) === String(user?.id))
    const prevComments = comments

    setComments(prev =>
      prev.map(c => {
        if (c._id !== comment._id) return c
        const likedBy = wasLiked
          ? c.likedBy.filter(id => String(id) !== String(user.id))
          : [...(c.likedBy || []), user.id]
        return { ...c, likedBy }
      })
    )

    try {
      if (wasLiked) {
        await api.delete(`/comment/${comment._id}/like`)
      } else {
        await api.post(`/comment/${comment._id}/like`)
      }
    } catch (error) {
      console.error("Failed to update like", error)
      toast.error("Failed to update like")
      setComments(prevComments)
    } finally {
      setLikingId(null)
    }
  }

  if (loading) {
    return <p className="etm-body" style={{ fontSize: '0.9rem', color: 'var(--etm-text-muted)' }}>Loading comments...</p>
  }

  if (comments.length === 0) {
    return <p className="etm-body" style={{ fontSize: '0.9rem', color: 'var(--etm-text-muted)' }}>No comments yet.</p>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
      {comments.map((comment) => {
        const isOwner = String(comment.author?._id) === String(user?.id)
        const isLiked = comment.likedBy?.some(id => String(id) === String(user?.id))

        return (
          <div key={comment._id} className="etm-card" style={{ position: 'relative' }}>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-sm)' }}>
              <div>
                <h4 className="etm-body" style={{ fontWeight: 600, marginBottom: '0.15rem', color: 'var(--etm-rust)' }}>
                  {comment.author?.username || "Anonymous"}
                </h4>
                <span className="etm-meta" style={{ fontSize: '0.75rem' }}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              {/* Three dot menu — owner only */}
              {isOwner && (
                <div
                  style={{ position: 'relative' }}
                  ref={el => menuRefs.current[comment._id] = el}
                >
                  <button
                    onClick={() => setOpenMenuId(prev => prev === comment._id ? null : comment._id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      color: 'var(--etm-rust)',
                      padding: '0 0.25rem',
                      lineHeight: 1,
                    }}
                  >
                    ···
                  </button>

                  {openMenuId === comment._id && (
                    <div style={{
                      position: 'absolute',
                      right: 0,
                      top: '1.5rem',
                      background: 'var(--etm-surface)',
                      border: '1px solid var(--etm-border)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                      zIndex: 10,
                      minWidth: '120px',
                      overflow: 'hidden',
                    }}>
                      <button
                        onClick={() => {
                          setEditingId(comment._id)
                          setEditText(comment.content)
                          setOpenMenuId(null)
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          padding: '0.6rem 1rem',
                          textAlign: 'left',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: 'var(--etm-text-on-light)',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(comment._id)}
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
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Content or Edit Input */}
            {editingId === comment._id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="etm-textarea etm-textarea--surface"
                  style={{ minHeight: '80px', fontSize: '0.9rem' }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 'var(--space-xs)' }}>
                  <button
                    onClick={() => handleEdit(comment._id)}
                    className="etm-btn etm-btn--primary"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => { setEditingId(null); setEditText('') }}
                    className="etm-btn etm-btn--ghost"
                    style={{ fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="etm-card__content" style={{ fontSize: '0.9rem', lineHeight: '1.6' }}>
                {comment.content}
              </p>
            )}

            {/* Footer */}
            <div className="etm-card__footer" style={{ marginTop: 'var(--space-sm)' }}>
              <button
                onClick={(e) => handleLikeComment(e, comment)}
                disabled={likingId === comment._id}
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
                {comment.likedBy?.length ?? 0}
              </button>
            </div>

          </div>
        )
      })}
    </div>
  )
}

export default CommentCard