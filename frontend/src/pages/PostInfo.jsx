import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import api from '../api/axios'
import toast from 'react-hot-toast'
import CommentCard from '../components/CommentCard'
import { ArrowBigLeft, Heart } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function PostInfo() {
    const { user } = useAuth()
    const [thought, setThought] = useState(null)
    const [loading, setLoading] = useState(false)
    const [content, setContent] = useState('')
    const [refreshKey, setRefreshKey] = useState(0)
    const [liking, setLiking] = useState(false)
    
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
            setRefreshKey(k => k + 1)
        } catch (error) {
            console.error("Failed to create comment", error)
            toast.error("Failed to comment")
        }
    }

    async function handleLikeClick(e) {
        e.preventDefault()
        e.stopPropagation()
        if (liking || !user) return

        setLiking(true)
        const wasLiked = thought.likedBy?.some(id => String(id) === String(user?.id))
        const prevThought = thought

        // optimistic update — thought is a single object, not an array
        setThought(prev => {
            const likedBy = wasLiked
                ? prev.likedBy.filter(id => String(id) !== String(user.id))
                : [...(prev.likedBy || []), user.id]
            return { ...prev, likedBy }
        })

        try {
            if (wasLiked) {
                await api.delete(`/thought/${thought._id}/like`)
            } else {
                await api.post(`/thought/${thought._id}/like`)
            }
        } catch (error) {
            console.error("Failed to update like", error)
            toast.error("Failed to update like")
            setThought(prevThought) // revert
        } finally {
            setLiking(false)
        }
    }

    // guard BEFORE any thought.x access
    if (loading || !thought) {
        return (
            <div className="etm-board etm-board--texture">
                <div className="etm-board__content etm-container">
                    <p className="etm-body">Loading...</p>
                </div>
            </div>
        )
    }

    // safe to derive from thought only AFTER the guard
    const isLiked = thought.likedBy?.some(id => String(id) === String(user?.id))

    return (
        <div className="etm-board etm-board--texture">
            <Link to="/home" className='absolute top-5 left-4 flex flex-row gap-3'>
                <ArrowBigLeft />Back
            </Link>

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
                                    <p className="etm-eyebrow" style={{ color: 'rgba(42, 26, 16, 0.6)' }}>
                                        Anonymous · Shared Thought
                                    </p>
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