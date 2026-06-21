import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import api from '../api/axios'
import toast from 'react-hot-toast'
import CommentCard from '../components/CommentCard'

function PostInfo() {

    const [thought, setThought] = useState(null)
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)
    
    const { id } = useParams()

    async function fetchThought() {
        setLoading(true)
        try {
            const res = await api.get(`/thought/${id}`)
            setThought(res.data)
        } catch (error) {
            console.error("Failed to fetch data", error)
            toast.error("Failed to fetch data")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchThought()
    }, [id])

    async function createComment() {
        if (!content.trim()) return
        try {
            await api.post(`/comment/create`, { content, thoughtId: thought._id })
            toast.success("Comment posted")
            setContent('')
            setRefreshKey(k => k + 1)  // tells CommentCard to refetch
        } catch (error) {
            console.error("Failed to create comment", error)
            toast.error("Failed to comment")
        }
    }

    if (loading || !thought) {
      return (
        <div className="etm-board etm-board--texture">
          <div className="etm-board__content etm-container">
            <p className="etm-body">Loading...</p>
          </div>
        </div>
      )
    }

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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-lg)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            
            {/* Left Column - Post Content */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="etm-card">
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <p className="etm-eyebrow" style={{ color: 'rgba(42, 26, 16, 0.6)' }}>Anonymous · Shared Thought</p>
                </div>

                <h1 className="etm-display etm-display--lg" style={{ marginBottom: 'var(--space-md)', color: 'var(--etm-text-on-light)' }}>
                    {thought.title}
                </h1>

                <div className="etm-card__content" style={{ marginBottom: 'var(--space-md)', fontSize: '1rem', lineHeight: '1.8' }}>
                  <p style={{ marginBottom: 'var(--space-sm)' }}>
                    {thought.content}
                  </p>
                </div>

                <div className="etm-card__footer">
                  <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(42, 26, 16, 0.7)' }}>
                      ❤️ {thought.likedBy?.length ?? 0} likes
                    </span>
                  </div>
                  <span className="etm-meta etm-meta--surface">2 days ago</span>
                </div>
              </div>
            </div>

            {/* Right Column - Comments */}
            <div style={{ gridColumn: 'span 1' }}>
              <div className="etm-card" style={{ height: 'fit-content' }}>
                <h2 className="etm-display etm-display--md" style={{ marginBottom: 'var(--space-md)', color: 'var(--etm-text-on-light)', fontSize: '1.3rem' }}>
                  Comments
                </h2>

                <div style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px dashed rgba(42, 26, 16, 0.15)' }}>
                  <textarea
                    placeholder="Share your thoughts..."
                    className="etm-textarea etm-textarea--surface"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    style={{ marginBottom: 'var(--space-xs)', minHeight: '100px' }}
                  />
                  <button className="etm-btn etm-btn--primary etm-btn--block" onClick={createComment}>
                    Post Comment
                  </button>
                </div>

                <CommentCard thought={thought} refreshKey={refreshKey} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostInfo