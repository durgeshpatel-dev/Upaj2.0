import React, { useState } from 'react'

import EnhancedChatWindow from '../components/chat/EnhancedChatWindow'
import EnhancedChatHistorySidebar from '../components/chat/EnhancedChatHistorySidebar'
import useChat from '../hooks/useChat'

const AdvancedChatSupport = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  
  const {
    currentChatId,
    messages,
    isLoading,
    chatHistory,
    sendMessage,
    startNewChat,
    loadChat,
    deleteChat,
    clearAllChats
  } = useChat()

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <div className="min-h-screen bg-[#0B1210] text-gray-200">
     
      <main className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white text-pretty">
              Advanced AI Chat Support 
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Intelligent farming assistant with persistent chat history and advanced features.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>AI Assistant Online</span>
            </div>
            
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md border border-[#1F2A24] bg-[#111C18] text-gray-300 hover:bg-[#12201B] transition-colors"
              title={sidebarCollapsed ? "Show chat history" : "Hide chat history"}
            >
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={sidebarCollapsed ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"} 
                />
              </svg>
            </button>
          </div>
        </header>

        <div className={`grid gap-4 transition-all duration-300 ${
          sidebarCollapsed 
            ? "grid-cols-1" 
            : "lg:grid-cols-[1fr_320px]"
        }`}>
          <EnhancedChatWindow 
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
          
          <div className={`${
            sidebarCollapsed ? "hidden lg:hidden" : "block"
          } transition-all duration-300`}>
            <EnhancedChatHistorySidebar 
              chatHistory={chatHistory}
              currentChatId={currentChatId}
              onNewChat={startNewChat}
              onLoadChat={loadChat}
              onDeleteChat={deleteChat}
              onClearAll={clearAllChats}
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#111C18] border border-[#1F2A24] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">Total Chats</h3>
            <p className="text-xl font-semibold text-white">
              {Object.keys(chatHistory).length}
            </p>
          </div>
          
          <div className="bg-[#111C18] border border-[#1F2A24] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">Current Chat Messages</h3>
            <p className="text-xl font-semibold text-white">
              {messages.length}
            </p>
          </div>
          
          <div className="bg-[#111C18] border border-[#1F2A24] rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-400">AI Status</h3>
            <p className={`text-xl font-semibold ${isLoading ? 'text-yellow-400' : 'text-green-400'}`}>
              {isLoading ? 'Thinking...' : 'Ready'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdvancedChatSupport
