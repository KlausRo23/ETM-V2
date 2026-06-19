import { createContext, useContext, useEffect, useState } from "react"
import api, { setAccessToken } from "../api/axios"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAuthStatus() {
      try {
        const res = await api.post("/auth/refresh")
        
        console.log('[AuthContext] Full refresh res.data:', res.data)
        
        const token = res.data.data.accessToken
        const userData = res.data.data.user

        console.log('[AuthContext] Token extracted:', token ? '✅ has value' : '❌ undefined')
        console.log('[AuthContext] User extracted:', userData ? '✅ has value' : '❌ undefined')

        setAccessToken(token)
        setUser(userData)
      } catch (error) {
        console.log('[AuthContext] Refresh failed — not authenticated:', error.response?.data || error.message)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  function login(userData, token) {
    console.log('[AuthContext] login() called | token:', token ? '✅ set' : '❌ undefined')
    setAccessToken(token)
    setUser(userData)
  }

  async function logout() {
    try {
      await api.post("/auth/logout")
    } finally {
      setAccessToken(null)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loading,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}