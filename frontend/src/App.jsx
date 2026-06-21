import React from 'react'
import { AuthProvider } from './context/AuthContext'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProtectedRoutes from './components/ProtectedRoutes'
import DashBoard from './pages/DashBoard'
import { Routes, Route } from 'react-router'
import CreatePage from './pages/CreatePage'
import ViewPendingPost from './pages/ViewPendingPost'
import PostInfo from './pages/PostInfo'

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>

          <Route index element={<LandingPage />}/>

          <Route path='/login' element={<LoginPage />} />

          <Route path='/register' element={<RegisterPage />} />

          <Route path='/home' element={
            <ProtectedRoutes>
              <DashBoard />
            </ProtectedRoutes> 
          } />

          <Route path='/create' element={
            <ProtectedRoutes>
              <CreatePage />
            </ProtectedRoutes>
          } />

          <Route path='/admin/submitted-posts' element={
            <ProtectedRoutes>
              <ViewPendingPost />
            </ProtectedRoutes>
          } />

          <Route path='/thought/:id' element={
            <ProtectedRoutes>
              <PostInfo />
            </ProtectedRoutes>
          } />
        </Routes>
      </AuthProvider>
    </div>
  )
}

export default App