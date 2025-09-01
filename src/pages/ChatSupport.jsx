import React from 'react'
import Navbar from '../components/Navbar'
import ChatWindow from '../components/chat/ChatWindow'
import ChatHistorySidebar from '../components/chat/ChatHistorySidebar'

const ChatSupport = () => {
  return (
    <div className="min-h-screen bg-[#0B1210] text-gray-200">
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-white text-pretty">AI Chat Support</h1>
          <p className="mt-1 text-sm text-gray-400">
            Ask our AI chatbot anything about CropWise or farming in general.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <ChatWindow />
          <ChatHistorySidebar />
        </div>
      </main>
    </div>
  )
}

export default ChatSupport
