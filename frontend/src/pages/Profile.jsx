import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'

const Profile = () => {

  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [username, setUsername] = useState(user?.username || '')
  const [profilePic, setProfilePic] = useState(null)
  const [preview, setPreview] = useState(user?.profilePic || null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const getInitial = (name) => name?.charAt(0).toUpperCase()

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setProfilePic(file)
      setPreview(URL.createObjectURL(file))
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('username', username)
      if (profilePic) {
        formData.append('profilePic', profilePic)
      }

      const res = await api.put('/users/profile', formData)

      // Update user in context and localStorage
      const token = localStorage.getItem('token')
      login(res.data, token)

      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0F1117' }}>

      <div className="w-full max-w-md p-8 rounded-2xl"
        style={{ backgroundColor: '#1A1D24', border: '1px solid #2B2F3A' }}>

        <button
          onClick={() => navigate('/home')}
          className="text-sm mb-6 hover:underline cursor-pointer"
          style={{ color: '#B0B0B0' }}>
          ← Back to Chats
        </button>

        <h2 className="text-xl font-semibold text-white mb-6">Your Profile</h2>

        {success && (
          <div className="mb-4 text-sm text-center" style={{ color: '#8B5CF6' }}>
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 text-sm text-center text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">

          {/* Profile Picture */}
          <div className="flex flex-col items-center gap-2 mb-2">
            <div className="w-24 h-24 rounded-full overflow-hidden flex items-center justify-center text-white text-2xl font-semibold"
              style={{ backgroundColor: '#8B5CF6', border: '2px solid #2B2F3A' }}>
              {preview ? (
                <img src={preview} alt="profile"
                  className="w-full h-full object-cover" />
              ) : (
                getInitial(username)
              )}
            </div>
            <label className="text-xs cursor-pointer hover:underline"
              style={{ color: '#8B5CF6' }}>
              Change Profile Picture
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#B0B0B0' }}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none"
              style={{ backgroundColor: '#0F1117', border: '1px solid #2B2F3A' }}
            />
          </div>

          {/* Email — read only */}
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#B0B0B0' }}>Email</label>
            <input
              type="email"
              value={user?.email || ''}
              readOnly
              className="w-full px-4 py-3 rounded-lg text-sm outline-none cursor-not-allowed"
              style={{
                backgroundColor: '#0F1117',
                border: '1px solid #2B2F3A',
                color: '#B0B0B0'
              }}
            />
            <span className="text-xs" style={{ color: '#B0B0B0' }}>
              Email cannot be changed
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium text-white mt-2 transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
            style={{ backgroundColor: '#8B5CF6' }}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>

        </form>
      </div>
    </div>
  )
}

export default Profile
