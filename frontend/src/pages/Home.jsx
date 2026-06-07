import React from 'react'
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatBox from '../components/ChatBox'

const dummyMessages = [
  { _id: '1', senderId: '1', text: 'Hey! How are you?', createdAt: '10:00 AM', imageUrl: null },
  { _id: '2', senderId: 'me', text: 'I am good! What about you?', createdAt: '10:01 AM', imageUrl: null },
  { _id: '3', senderId: '1', text: 'Doing great! Working on a project.', createdAt: '10:02 AM', imageUrl: null },
  { _id: '4', senderId: 'me', text: 'Nice! What kind of project?', createdAt: '10:03 AM', imageUrl: null },
  { _id: '5', senderId: '1', text: 'A chat app using MERN stack 😄', createdAt: '10:04 AM', imageUrl: null },
]

const Home = () => {

   const [messages, setMessages] = useState({
    '1': dummyMessages, // Alice has dummy messages
  })

   // Which user is currently selected to chat with
  const [selectedUser, setSelectedUser] = useState(null)

  // On mobile, toggle between sidebar and chatbox
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

      {/* SIDEBAR — hidden on mobile when chat is open */}
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

      {/* CHAT AREA — hidden on mobile when no user selected */}
      <div className={`
          flex-1
          ${!showChat ? 'hidden md:flex' : 'flex'}
          flex-col
        `}>
        <ChatBox
  selectedUser={selectedUser}
  onBack={handleBack}
  messages={messages}
  setMessages={setMessages}
/>
      </div>

    </div>
  )
}

export default Home
