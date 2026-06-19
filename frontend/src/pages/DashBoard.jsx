import React, { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import PostCard from '../components/PostCard'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const [thoughts, setThoughts] = useState([])
  const [loading, setLoading] = useState(false)
 const { loading: authLoading, isAuthenticated } = useAuth()

useEffect(() => {
   console.log('[Dashboard] effect fired — authLoading:', authLoading, '| isAuthenticated:', isAuthenticated)
  if (authLoading) return
  if (!isAuthenticated) return  // ← don't fire if there's no logged-in user/token yet

  let active = true

  async function getThoughts() {
    setLoading(true)
    try {
      const res = await api.get("/thought/")
      if (!active) return
      setThoughts(res.data.data)
    } catch (error) {
      if (!active) return
      console.error("Cannot get thoughts", error)
      toast.error("Failed to fetch thoughts")
    } finally {
      if (active) setLoading(false)
    }
  }

  getThoughts()

  return () => {
    active = false
  }
}, [authLoading, isAuthenticated])

const approvedThoughts = (thoughts || []).filter(t => t.isApprove === "approved")

  return (
    <div>
      <header><NavBar /></header>
      <main className='px-20 py-10'>
        <div className='flex overflow-y-auto w-full h-auto'>
          {approvedThoughts.map((thought, index) => (
            <PostCard key={thought._id} thought={thought} index={index} setThoughts={setThoughts} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default Dashboard