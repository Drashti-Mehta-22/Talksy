import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiSearch, FiLogOut, FiUser } from 'react-icons/fi'

  const currentUser = {
  _id: 'me',
  username: 'Abc',
  profilePic: null
}

// Dummy users list
const dummyUsers = [
  { _id: '1', username: 'Alice', profilePic: null, lastMessage: 'Hey there!', lastMessageAt: '10:30 AM' },
  { _id: '2', username: 'Bob', profilePic: null, lastMessage: 'See you tomorrow', lastMessageAt: '9:15 AM' },
  { _id: '3', username: 'Carol', profilePic: null, lastMessage: 'Sounds good!', lastMessageAt: 'Yesterday' },
  { _id: '4', username: 'David', profilePic: null, lastMessage: 'Ok got it', lastMessageAt: 'Yesterday' },
  { _id: '5', username: 'Eva', profilePic: null, lastMessage: 'Thanks!', lastMessageAt: 'Monday' },
]

const Sidebar = ({ selectedUser, onSelectUser }) => {

  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  // Filter users based on search input
  const filteredUsers = dummyUsers.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = () => {
    // TODO: clear token later
    navigate('/login')
  }

  // Get first letter of username for avatar placeholder
  const getInitial = (name) => name?.charAt(0).toUpperCase()


  return (
    <div className="flex flex-col h-full"
      style={{ backgroundColor: '#1A1D24' }}>

      {/* TOP — App name + icons */}
      <div className="flex items-center justify-between px-4 py-4"
        style={{ borderBottom: '1px solid #2B2F3A' }}>

        <h1 className="text-lg font-semibold text-white">Talksy</h1>

        <div className="flex items-center gap-3">
          {/* Profile Icon */}
          <button
            onClick={() => navigate('/profile')}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <FiUser size={18} />
          </button>

          {/* Logout Icon */}
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div className="px-4 py-3"
        style={{ borderBottom: '1px solid #2B2F3A' }}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg"
          style={{ backgroundColor: '#0F1117', border: '1px solid #2B2F3A' }}>
          <FiSearch size={15} style={{ color: '#B0B0B0' }} />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white outline-none w-full placeholder-gray-500"
          />
        </div>
      </div>

      {/* USER LIST */}
      <div className="flex-1 overflow-y-auto">

        {filteredUsers.length === 0 ? (
          <p className="text-center text-sm mt-6" style={{ color: '#B0B0B0' }}>
            No users found
          </p>
        ) : (
          filteredUsers.map(user => (
            <div
              key={user._id}
              onClick={() => onSelectUser(user)}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:opacity-80"
              style={{
                backgroundColor: selectedUser?._id === user._id ? '#0F1117' : 'transparent',
                borderBottom: '1px solid #2B2F3A'
              }}>

              {/* Avatar */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-medium text-sm"
                style={{ backgroundColor: '#8B5CF6' }}>
                {user.profilePic ? (
                  <img src={user.profilePic} alt={user.username}
                    className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitial(user.username)
                )}
              </div>

              {/* Name + Last Message */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white truncate">
                    {user.username}
                  </p>
                  <span className="text-xs shrink-0 ml-2"
                    style={{ color: '#B0B0B0' }}>
                    {user.lastMessageAt}
                  </span>
                </div>
                <p className="text-xs truncate mt-0.5"
                  style={{ color: '#B0B0B0' }}>
                  {user.lastMessage}
                </p>
              </div>

            </div>
          ))
        )}
      </div>

      {/* BOTTOM — Current user info */}
      <div className="flex items-center gap-3 px-4 py-3"
        style={{ borderTop: '1px solid #2B2F3A' }}>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0"
          style={{ backgroundColor: '#8B5CF6' }}>
          {getInitial(currentUser.username)}
        </div>

        <p className="text-sm text-white truncate">{currentUser.username}</p>
      </div>

    </div>
  )
}

export default Sidebar
