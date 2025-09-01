import React from 'react'
import { formatTimestamp } from '../../utils/chatUtils'

const MessageBubble = ({ role, text, timestamp }) => {
  const isAI = role === "ai"
  
  return (
    <div
      className={`max-w-[80%] rounded-lg border px-3 py-2 text-sm group ${
        isAI
          ? "ml-0 mr-auto border-[#1F2A24] bg-[#0E1613] text-gray-200"
          : "ml-auto mr-0 border-transparent bg-[#22C55E] text-black"
      }`}
    >
      <div className="flex items-start gap-2">
        {isAI && (
          <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-xs font-medium text-black">AI</span>
          </div>
        )}
        <div className="flex-1">
          <p className="whitespace-pre-wrap">{text}</p>
          {timestamp && (
            <p className={`text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
              isAI ? "text-gray-500" : "text-black/60"
            }`}>
              {formatTimestamp(timestamp)}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MessageBubble
