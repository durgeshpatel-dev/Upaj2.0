import React from 'react'
import Button from '../Button'

const chatHistory = [
  { title: "Yield Prediction Metrics", excerpt: "Hi, I'm having trouble understanding...", active: true },
  { title: "Soil Health Questions", excerpt: "What's the best way to improve clay...", active: false },
  { title: "Pest Control Advice", excerpt: "I've noticed some aphids on my...", active: false },
]

const ChatHistorySidebar = () => {
  return (
    <aside className="rounded-lg border border-[#1F2A24] bg-[#111C18] p-4">
      <h3 className="text-sm font-medium text-white">Chat History</h3>
      <div className="mt-3 space-y-2">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`rounded-md border px-3 py-2 cursor-pointer transition-colors ${
              chat.active 
                ? "border-[#22C55E] bg-[#0E1613]" 
                : "border-[#1F2A24] bg-[#0E1613] hover:bg-[#12201B]"
            }`}
          >
            <p className="text-sm text-white">{chat.title}</p>
            <p className="text-xs text-gray-500">{chat.excerpt}</p>
          </div>
        ))}
      </div>
      <Button
        variant="outline"
        className="mt-4 w-full border-dashed border-[#1F2A24] bg-[#0E1613] text-gray-200 hover:bg-[#12201B]"
      >
        + New Chat
      </Button>
    </aside>
  )
}

export default ChatHistorySidebar
