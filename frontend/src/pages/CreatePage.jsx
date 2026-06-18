import { XIcon } from 'lucide-react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router'
import api from '../api/axios'

function Create() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    const trimmedTitle = title.trim()
    const trimmedContent = content.trim()

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Put something...")
      return
    }

    setLoading(true)
    try {
      await api.post("/thought/create", { title: trimmedTitle, content: trimmedContent})
      toast.success("Your Thoughts are now posted")
      navigate("/home")
    } catch (error) {
      console.log("Error in create", error)
      if (error.response?.status === 429) {
        toast.error("Okay please slow down! Try creating after a minute", { duration: 4000 })
      } else {
        toast.error("Failed to create Note")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="etm-board flex justify-center items-start py-8 px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col w-full sm:w-3/4 md:w-2/3 lg:w-1/2
        bg-[#F5EDE1] px-6 md:px-10 py-12 rounded-md relative gap-6"
      >
        <Link to="/home" aria-label="Close and go back">
          <XIcon className='size-8 absolute top-4 right-4 bg-[#A0522D]
          rounded-full p-1 text-white hover:bg-[#C9772E] transition-colors duration-300' />
        </Link>

        <h1 className="text-center font-['Caveat'] text-3xl md:text-4xl font-semibold
        text-[#A0522D]">Pin a new thought</h1>

        <div className='flex flex-col gap-8'>

          <div className='flex flex-col gap-1'>
            <label htmlFor="thought-title" className='text-base text-[#6B2F0F] md:text-lg font-semibold tracking-widest'>
              Title
            </label>
            <input
              id="thought-title"
              type='text'
              placeholder='A short Title'
              value={title}
              maxLength={50}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              className='p-2 rounded-md bg-[#FFFDF0] border-2 shadow-lg outline-none
              focus:border-[#A0522D] transition-colors duration-300
              disabled:opacity-60 disabled:cursor-not-allowed text-[#6B2F0F]'
              autoFocus
            />
            <p className={`text-[10px] mt-1 ${title.length >= 45 ? 'text-[#B23A2E]' : 'text-gray-400'}`}>
              {title.length}/50
            </p>
          </div>

          <div className='flex flex-col gap-1'>
            <label htmlFor="thought-content" className='text-base text-[#6B2F0F] md:text-lg font-semibold tracking-widest'>
              Your Thoughts
            </label>
            <textarea
              id="thought-content"
              placeholder='Write everything, every thoughts matter'
              onChange={(e) => setContent(e.target.value)}
              maxLength={1000}
              value={content}
              disabled={loading}
              className='p-2 rounded-md bg-[#FFFDF0] border-2 shadow-lg
              h-48 md:h-72 resize-none outline-none focus:border-[#A0522D]
              transition-colors duration-300 leading-relaxed
              disabled:opacity-60 disabled:cursor-not-allowed text-[#6B2F0F]'
            />
            <p className={`text-[10px] mt-1 ${content.length >= 900 ? 'text-[#B23A2E]' : 'text-gray-400'}`}>
              {content.length}/1000
            </p>
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 mt-2 rounded-lg text-white tracking-wider
          bg-[#A0522D] hover:bg-[#C9772E] transition-colors duration-300
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Pinning..." : "Pin My Thought"}
        </button>

      </form>
    </div>
  )
}

export default Create