import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import socket from '../services/socket'

const Registration = () => {

  const navigate = useNavigate()
  const { login } = useAuth()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')

    if (!username || !email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      // FormData because we might have an image file
      const formData = new FormData()
      formData.append('username', username)
      formData.append('email', email)
      formData.append('password', password)
      if (profilePic) {
        formData.append('profilePic', profilePic)
      }

      const res = await api.post('/auth/register', formData)

      // Store user in context and localStorage
      login(res.data.user, res.data.token)

      // Connect socket and register user
      socket.connect()
      socket.emit('join', res.data.user._id)

      navigate('/home')

    } catch (err) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: '#0F1117' }}>

      <div className="w-full max-w-md p-8 rounded-2xl"
        style={{ backgroundColor: '#1A1D24', border: '1px solid #2B2F3A' }}>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Talksy</h1>
          <p className="mt-2 text-sm" style={{ color: '#B0B0B0' }}>
            Create your account to get started.
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">

          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
              style={{ backgroundColor: '#0F1117', border: '2px solid #2B2F3A' }}>
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl" style={{ color: '#B0B0B0' }}>👤</span>
              )}
            </div>
            <label className="text-xs cursor-pointer hover:underline"
              style={{ color: '#8B5CF6' }}>
              Profile Picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#B0B0B0' }}>Username</label>
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
              style={{ backgroundColor: '#0F1117', border: '1px solid #2B2F3A' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#B0B0B0' }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
              style={{ backgroundColor: '#0F1117', border: '1px solid #2B2F3A' }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#B0B0B0' }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
              style={{ backgroundColor: '#0F1117', border: '1px solid #2B2F3A' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium text-white mt-2 transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
            style={{ backgroundColor: '#8B5CF6' }}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>

        </form>

        <p className="mt-6 text-sm text-center" style={{ color: '#B0B0B0' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#8B5CF6' }} className="hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Registration
