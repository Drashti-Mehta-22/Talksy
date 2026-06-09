import React from 'react'
import { useState, useRef, useEffect } from 'react'
import TypingIndicator from './TypingIndicator'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import socket from '../services/socket'

// Dummy messages data

const ChatBox = ({ selectedUser, onBack }) => {

  const { user } = useAuth()

  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Fetch messages when selected user changes
  useEffect(() => {
    if (!selectedUser) return

    const fetchMessages = async () => {
      setLoading(true)
      try {
        const res = await api.get(`/messages/${selectedUser._id}`)
        setMessages(res.data)
      } catch (err) {
        console.log('Fetch messages error:', err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [selectedUser])

  // Socket.io — listen for incoming messages and typing
  useEffect(() => {
    // When receiver gets a new message
    socket.on('receiveMessage', (message) => {
      // Only add if it's from the currently open chat
      if (message.senderId === selectedUser?._id) {
        setMessages(prev => [...prev, message])
      }
    })

    // When receiver sees typing indicator
    socket.on('typing', () => {
      setIsTyping(true)
    })

    // When typing stops
    socket.on('stopTyping', () => {
      setIsTyping(false)
    })

    // Cleanup — remove listeners when component unmounts or user changes
    return () => {
      socket.off('receiveMessage')
      socket.off('typing')
      socket.off('stopTyping')
    }
  }, [selectedUser])

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const removeImage = () => {
    setImage(null)
    setImagePreview(null)
  }

  // Handle typing indicator
  const handleTyping = (e) => {
    setNewMessage(e.target.value)

    // Emit typing event
    socket.emit('typing', { receiverId: selectedUser._id })

    // Clear previous timeout
    clearTimeout(typingTimeoutRef.current)

    // After 1.5 seconds of no typing, emit stopTyping
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { receiverId: selectedUser._id })
    }, 1500)
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() && !image) return

    try {
      // FormData because we might have an image
      const formData = new FormData()
      formData.append('text', newMessage)
      if (image) {
        formData.append('image', image)
      }

      const res = await api.post(`/messages/send/${selectedUser._id}`, formData)
      const sentMessage = res.data

      // Add message to local state
      setMessages(prev => [...prev, sentMessage])

      // Emit to socket so receiver gets it instantly
      socket.emit('sendMessage', {
        receiverId: selectedUser._id,
        message: sentMessage
      })

      // Stop typing indicator
      socket.emit('stopTyping', { receiverId: selectedUser._id })

      setNewMessage('')
      setImage(null)
      setImagePreview(null)

    } catch (err) {
      console.log('Send message error:', err.message)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const getInitial = (name) => name?.charAt(0).toUpperCase()

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full"
        style={{ backgroundColor: '#0F1117' }}>
        <div className="text-5xl mb-4">💬</div>
        <p className="text-lg font-medium text-white">Welcome to Talksy</p>
        <p className="text-sm mt-1" style={{ color: '#B0B0B0' }}>
          Select a user from the sidebar to start chatting
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: '#0F1117' }}>

      {/* ── HEADER ── */}
      <div className="flex items-center gap-3 px-4 py-3 shrink-0"
        style={{ backgroundColor: '#1A1D24', borderBottom: '1px solid #2B2F3A' }}>

        <button
          onClick={onBack}
          className="md:hidden text-gray-400 hover:text-white mr-1 cursor-pointer">
          ←
        </button>

        <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0 overflow-hidden"
          style={{ backgroundColor: '#8B5CF6' }}>
          {selectedUser.profilePic ? (
            <img src={selectedUser.profilePic} alt={selectedUser.username}
              className="w-full h-full object-cover" />
          ) : (
            getInitial(selectedUser.username)
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-white">{selectedUser.username}</p>
          <p className="text-xs" style={{ color: '#B0B0B0' }}>
            {isTyping ? 'typing...' : 'online'}
          </p>
        </div>

      </div>

      {/* ── MESSAGES ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">

        {loading ? (
          <p className="text-center text-sm mt-6" style={{ color: '#B0B0B0' }}>
            Loading messages...
          </p>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm mt-6" style={{ color: '#B0B0B0' }}>
            No messages yet. Say hello! 👋
          </p>
        ) : (
          messages.map(msg => {
            const isMyMessage = msg.senderId === user._id

            return (
              <div key={msg._id}
                className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>

                <div className="max-w-xs lg:max-w-md">

                  {msg.imageUrl && (
                    <img
                      src={msg.imageUrl}
                      alt="shared"
                      className="rounded-xl mb-1 max-w-full"
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  )}

                  {msg.text && (
                    <div className="px-4 py-2 text-sm"
                      style={{
                        backgroundColor: isMyMessage ? '#8B5CF6' : '#1A1D24',
                        color: '#FFFFFF',
                        borderRadius: isMyMessage
                          ? '18px 18px 4px 18px'
                          : '18px 18px 18px 4px'
                      }}>
                      {msg.text}
                    </div>
                  )}

                  <p className={`text-xs mt-1 ${isMyMessage ? 'text-right' : 'text-left'}`}
                    style={{ color: '#B0B0B0' }}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>

                </div>
              </div>
            )
          })
        )}

        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />

      </div>

      {/* ── IMAGE PREVIEW ── */}
      {imagePreview && (
        <div className="px-4 py-2 flex items-center gap-2 shrink-0"
          style={{ borderTop: '1px solid #2B2F3A' }}>
          <div className="relative">
            <img src={imagePreview} alt="preview"
              className="h-16 w-16 object-cover rounded-lg" />
            <button
              onClick={removeImage}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center cursor-pointer"
              style={{ backgroundColor: '#8B5CF6' }}>
              ✕
            </button>
          </div>
          <p className="text-xs" style={{ color: '#B0B0B0' }}>Image ready to send</p>
        </div>
      )}

      {/* INPUT */}
      <div className="flex items-center gap-2 px-4 py-3 shrink-0"
        style={{ backgroundColor: '#1A1D24', borderTop: '1px solid #2B2F3A' }}>
          
          {/* Image Upload Button */}
        <label className="cursor-pointer text-xl shrink-0"
          style={{ color: '#B0B0B0' }}>
          📎
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={handleTyping}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 rounded-xl text-sm text-white outline-none"
          style={{ backgroundColor: '#0F1117', border: '1px solid #2B2F3A' }}
        />
        
        {/* Send Button */}
        <button
          onClick={handleSendMessage}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
          style={{ backgroundColor: '#8B5CF6' }}>
          ➤
        </button>

      </div>
    </div>
  )
}

export default ChatBox
