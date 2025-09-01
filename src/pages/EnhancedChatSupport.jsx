import React from 'react'

import ChatWindow from '../components/chat/ChatWindow'
import ChatHistorySidebar from '../components/chat/ChatHistorySidebar'
import useChat from '../hooks/useChat'

const EnhancedChatSupport = () => {
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

  return (
    <div className="min-h-screen bg-[#0B1210] text-gray-200">
      
      <main className="mx-auto max-w-7xl px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-white text-pretty">
            Enhanced AI Chat Support 00
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Ask our advanced AI chatbot anything about CropWise or farming. 
            Your chat history is automatically saved.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <ChatWindow 
            messages={messages}
            isLoading={isLoading}
            onSendMessage={sendMessage}
          />
          <ChatHistorySidebar 
            chatHistory={chatHistory}
            currentChatId={currentChatId}
            onNewChat={startNewChat}
            onLoadChat={loadChat}
            onDeleteChat={deleteChat}
            onClearAll={clearAllChats}
          />
        </div>
      </main>
    </div>
  )
}

export default EnhancedChatSupport
