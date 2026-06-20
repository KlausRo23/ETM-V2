import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import PostCard from '../components/PostCard-2'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(false)
  const { loading: authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) return

    let active = true

    async function getApprovedThoughts() {
      setLoading(true)
      try {
        const res = await api.get("/thought/")
        if (!active) return
        setThoughts(res.data) // plain array, matches getAllApprovedThoughts
      } catch (error) {
        if (!active) return
        console.error("Failed to get approved thoughts", error)
        toast.error("Failed to fetch posts")
      } finally {
        if (active) setLoading(false)
      }
    }

    getApprovedThoughts()

    return () => {
      active = false
    }
  }, [authLoading, isAuthenticated])

  return (
    <div>
      <header><NavBar /></header>
      <main className='px-20 py-10'>
        <div className='flex overflow-y-auto w-full h-auto'>
          {thoughts.map((thought, index) => (
            <PostCard key={thought._id} thought={thought} index={index} setThoughts={setThoughts} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard