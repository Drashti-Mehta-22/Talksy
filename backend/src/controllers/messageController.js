import Message from '../models/Message.js'
import Conversation from '../models/Conversation.js'

// SEND MESSAGE
export const sendMessage = async (req, res) => {
  try {
    const { text, imageUrl } = req.body
    const receiverId = req.params.receiverId
    const senderId = req.user._id

    // Find existing conversation between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    // If no conversation exists, create one
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId]
      })
    }

    // Create the message
    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      receiverId,
      text: text || '',
      imageUrl: imageUrl || '',
    })

    // Update conversation's last message
    conversation.lastMessage = text || 'Image'
    conversation.lastMessageAt = Date.now()
    await conversation.save()

    res.status(201).json(message)

  } catch (error) {
    console.log('Send message error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}

// GET MESSAGES
export const getMessages = async (req, res) => {
  try {
    const receiverId = req.params.receiverId
    const senderId = req.user._id

    // Find conversation between these two users
    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    })

    // If no conversation yet, return empty array
    if (!conversation) {
      return res.status(200).json([])
    }

    // Get all messages of this conversation
    const messages = await Message.find({
      conversationId: conversation._id
    }).sort({ createdAt: 1 })

    res.status(200).json(messages)

  } catch (error) {
    console.log('Get messages error:', error.message)
    res.status(500).json({ message: 'Server error' })
  }
}