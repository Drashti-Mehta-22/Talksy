import React from 'react'

const TypingIndicator = () => {
  return (
     <div className="flex justify-start">
      <div className="px-4 py-2 rounded-2xl text-sm"
        style={{
          backgroundColor: '#1A1D24',
          borderRadius: '18px 18px 18px 4px'
        }}>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: '#B0B0B0', animationDelay: '0ms' }} />
          <span className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: '#B0B0B0', animationDelay: '150ms' }} />
          <span className="w-2 h-2 rounded-full animate-bounce"
            style={{ backgroundColor: '#B0B0B0', animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
