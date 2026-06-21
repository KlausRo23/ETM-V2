import React, { useState } from 'react'

function PostInfo() {
  const [comments, setComments] = useState([
    {
      _id: '1',
      author: 'Sarah Chen',
      content: 'This really resonates with me. Thank you for sharing.',
      likes: 12,
      createdAt: '2 hours ago'
    },
    {
      _id: '2',
      author: 'Marcus J',
      content: 'Couldn\'t have said it better myself. The vulnerability here is beautiful.',
      likes: 8,
      createdAt: '1 hour ago'
    },
    {
      _id: '3',
      author: 'Alex',
      content: 'This made my day. Needed to read this.',
      likes: 5,
      createdAt: '45 minutes ago'
    }
  ])

  const [newComment, setNewComment] = useState('')

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
          {/* Main grid: post on left, comments on right */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
            
            {/* Left Column - Post Content */}
            <div style={{ gridColumn: 'span 2' }}>
              <div className="etm-card">
                {/* Post Header */}
                <div style={{ marginBottom: 'var(--space-md)' }}>
                  <p className="etm-eyebrow" style={{ color: 'rgba(42, 26, 16, 0.6)' }}>Anonymous · Shared Thought</p>
                </div>

                {/* Post Title */}
                <h1 className="etm-display etm-display--lg" style={{ marginBottom: 'var(--space-md)', color: 'var(--etm-text-on-light)' }}>
                  Sometimes the smallest moments matter the most
                </h1>

                {/* Post Content */}
                <div className="etm-card__content" style={{ marginBottom: 'var(--space-md)', fontSize: '1rem', lineHeight: '1.8' }}>
                  <p style={{ marginBottom: 'var(--space-sm)' }}>
                    I've been thinking a lot lately about how we often overlook the quiet moments in life. The ones that don't make headlines or get shared on social media, but somehow change everything.
                  </p>
                  
                  <p style={{ marginBottom: 'var(--space-sm)' }}>
                    It's the coffee shared with an old friend. The unexpected text from someone who was thinking of you. The way sunlight hits your desk on a Tuesday morning. These moments are fragile and fleeting, but they're where real life happens.
                  </p>

                  <p>
                    I think we need to be more intentional about noticing them. To pause and really be present. Because in the end, it's not the big achievements that stay with us—it's these small, tender moments that shape who we become.
                  </p>
                </div>

                {/* Post Stats */}
                <div className="etm-card__footer">
                  <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(42, 26, 16, 0.7)' }}>❤️ 156 likes</span>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(42, 26, 16, 0.7)' }}>💬 23 comments</span>
                  </div>
                  <span className="etm-meta etm-meta--surface">2 days ago</span>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                  <button className="etm-btn etm-btn--primary etm-btn--block">
                    ❤️ Like
                  </button>
                  <button className="etm-btn etm-btn--ghost etm-btn--block">
                    💬 Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Comments */}
            <div style={{ gridColumn: 'span 1' }}>
              <div className="etm-card" style={{ height: 'fit-content' }}>
                <h2 className="etm-display etm-display--md" style={{ marginBottom: 'var(--space-md)', color: 'var(--etm-text-on-light)', fontSize: '1.3rem' }}>
                  Comments
                </h2>

                {/* Add Comment Form */}
                <div style={{ marginBottom: 'var(--space-md)', paddingBottom: 'var(--space-md)', borderBottom: '1px dashed rgba(42, 26, 16, 0.15)' }}>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="etm-textarea etm-textarea--surface"
                    style={{ marginBottom: 'var(--space-xs)', minHeight: '100px' }}
                  />
                  <button className="etm-btn etm-btn--primary etm-btn--block">
                    Post Comment
                  </button>
                </div>

                {/* Comments List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {comments.map((comment, idx) => (
                    <div key={comment._id} style={{ paddingBottom: idx !== comments.length - 1 ? 'var(--space-md)' : '0', borderBottom: idx !== comments.length - 1 ? '1px dashed rgba(42, 26, 16, 0.15)' : 'none' }}>
                      <div style={{ marginBottom: 'var(--space-xs)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--etm-text-on-light)' }}>
                            {comment.author}
                          </h4>
                          <span className="etm-meta etm-meta--surface" style={{ fontSize: '0.75rem' }}>
                            {comment.createdAt}
                          </span>
                        </div>
                      </div>
                      
                      <p style={{ fontSize: '0.9rem', color: 'rgba(42, 26, 16, 0.85)', lineHeight: '1.5', marginBottom: 'var(--space-xs)' }}>
                        {comment.content}
                      </p>

                      <button style={{ fontSize: '0.8rem', color: 'var(--etm-rust)', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem 0', transition: 'opacity var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.opacity = '0.7'} onMouseLeave={(e) => e.target.style.opacity = '1'}>
                        ❤️ {comment.likes}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostInfo
