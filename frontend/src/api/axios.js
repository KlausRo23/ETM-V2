import axios from 'axios'

let accessToken = null

export function setAccessToken(token) {
  accessToken = token
}

export function getAccessToken() {
  return accessToken
}

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  console.log('[Request]', config.method?.toUpperCase(), config.url, '| token:', accessToken ? '✅ set' : '❌ null')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Handle expired token — auto refresh and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // don't retry if the refresh endpoint itself failed
    if (original.url?.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        console.log('[Interceptor] 401 hit — attempting refresh...')
        const res = await api.post('/auth/refresh')
        console.log('[Interceptor] Refresh response:', res.data)
        
        const newToken = res.data.data.accessToken
        console.log('[Interceptor] New token:', newToken ? '✅ received' : '❌ undefined')
        
        setAccessToken(newToken)
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (err) {
        console.log('[Interceptor] Refresh failed, redirecting to login', err)
        setAccessToken(null)
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api