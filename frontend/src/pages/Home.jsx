import React from 'react'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'

const Home = () => {

  
  const [selectedUser, setSelectedUser] = useState(null)
  const [showChat, setShowChat] = useState(false)

  const handleSelectUser = (user) => {
    setSelectedUser(user)
    setShowChat(true)
  }

  const handleBack = () => {
    setShowChat(false)
    setSelectedUser(null)
  }

  return (
    <div className="h-screen flex overflow-hidden"
      style={{ backgroundColor: '#0F1117' }}>

      <div className={`
          w-full md:w-80 lg:w-96 shrink-0
          ${showChat ? 'hidden md:flex' : 'flex'}
          flex-col
        `}
        style={{ borderRight: '1px solid #2B2F3A' }}>
        <Sidebar
          selectedUser={selectedUser}
          onSelectUser={handleSelectUser}
        />
      </div>

      <div className={`
          flex-1
          ${!showChat ? 'hidden md:flex' : 'flex'}
          flex-col
        `}>
        <ChatBox
          selectedUser={selectedUser}
          onBack={handleBack}
        />
      </div>

    </div>
  )
}

export default Home
