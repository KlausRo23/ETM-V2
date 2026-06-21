import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../api/axios'

function CommentCard({ thought, refreshKey }) {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getComments() {
      setLoading(true)
      try {
        const res = await api.get(`/comment/${thought._id}/comments`)
        console.log('Comments response:', res.data)
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

  if (loading) {
    return <p className="etm-body text-sm">Loading comments...</p>
  }

  if (comments.length === 0) {
    return <p className="etm-body text-sm">No comments yet.</p>
  }

  return (
    <div className="flex flex-col gap-4">
      {comments.map((comment) => (
        <div key={comment._id} className="etm-card max-w-sm m-4">
          <div className="mb-4">
            <div className="flex justify-between items-start mb-1">
              <h4 className="text-sm font-semibold text-[var(--etm-text-on-light)]">
                {comment.author?.username || "Anonymous"}
              </h4>
              <span className="etm-meta etm-meta--surface text-xs">
                {comment.createdAt}
              </span>
            </div>
          </div>

          <p className="etm-card__content mb-4 text-sm leading-relaxed">
            {comment.content}
          </p>

          <div className="etm-card__footer">
            <button className="text-xs font-semibold text-[var(--etm-rust)] bg-none border-none cursor-pointer p-1 transition-opacity hover:opacity-70">
              ❤️ {comment.likedBy?.length ?? 0}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CommentCard