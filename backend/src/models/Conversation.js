import mongoose from 'mongoose'

const conversationSchema = new mongoose.Schema(
  {
    // The two users in this conversation
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      }
    ],

    // Last message text for sidebar preview
    lastMessage: {
      type: String,
      default: '',
    },

    // When last message was sent — used for sorting sidebar
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

const Conversation = mongoose.model('Conversation', conversationSchema)

export default Conversation