import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        async function checkAuthStatus() {
            setLoading()
            
            try {
                const res = await api.post("/auth/refresh")
                setUser(res.data.data.user) // adjust if your response shape differs
            } catch (error) {
                console.log("Fail in authentication", error)
                setUser(null)
            } finally {
                setLoading(false)
                setIsInitialized(true) // Mark as initialized after first check
            }
        }
        checkAuthStatus()
    }, [])

    function login(userData) {
        setUser(userData)
    }

    async function logout() {
        try {
            await api.post("/auth/logout")
        } finally {
            setUser(null)
        }
    }

    // Show loading screen while initial auth check is happening
    if (!isInitialized) {
        return (
            <div className="min-h-screen bg-[#3D1500] flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-[rgba(251,245,236,0.2)] border-t-[#C9772E] rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[#FBF5EC] text-lg font-medium">Loading...</p>
                </div>
            </div>
        )
    }

    // Once initialized, render the app with context provider
    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
