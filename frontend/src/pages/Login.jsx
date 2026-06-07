import React from 'react'
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

   const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    //validation
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)

    // TODO: connect to backend later
    // For now just navigate to home
    setTimeout(() => {
      setLoading(false)
      navigate('/home')
    }, 1000)
  }
  return (
     <div className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: '#0F1117' }}>

      <div className="w-full max-w-md p-8 rounded-2xl"
        style={{ backgroundColor: '#1A1D24', border: '1px solid #2B2F3A' }}>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Talksy</h1>
          <p className="mt-2 text-sm" style={{ color: '#B0B0B0' }}>
            Login to continue.
          </p>
        </div>

        {/* Error Message in case of login failure*/}
        {error && (
          <div className="mb-4 text-sm text-red-400 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#ffffff' }}>
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none focus:ring-2"
              style={{
                backgroundColor: '#0F1117',
                border: '1px solid #2B2F3A',
                focusRingColor: '#8B5CF6'
              }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm" style={{ color: '#ffffff' }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none focus:ring-2"
              style={{
                backgroundColor: '#0F1117',
                border: '1px solid #2B2F3A',
              }}
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg text-sm font-medium text-white mt-2 transition-opacity hover:opacity-90 disabled:opacity-60 cursor-pointer"
            style={{ backgroundColor: '#8B5CF6' }}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        {/* Link for New user */}
        <p className="mt-6 text-sm text-center" style={{ color: '#B0B0B0' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#8B5CF6' }} className="hover:underline">
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
