import { createContext, useContext, useEffect, useState } from "react";
import api, { setAccessToken } from "../api/axios";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkAuthStatus() {
            try {
                const res = await api.post("/auth/refresh")
                setAccessToken(res.data.data.accessToken)
                setUser(res.data.data.user)
            } catch (error) {
                console.log("Fail in authentication", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }
        checkAuthStatus()
    }, [])

    function login(userData, accessToken) {
        setAccessToken(accessToken)
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
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}