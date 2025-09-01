import React, { useState } from 'react'
import Button from '../Button'
import { formatTimestamp, exportChatHistory } from '../../utils/chatUtils'

const EnhancedChatHistorySidebar = ({ 
  chatHistory = {}, 
  currentChatId, 
  onNewChat, 
  onLoadChat, 
  onDeleteChat, 
  onClearAll 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  const chatEntries = Object.entries(chatHistory)
    .sort(([, a], [, b]) => b.lastUpdated - a.lastUpdated)
    .slice(0, 10) // Show only recent 10 chats

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation()
    if (showDeleteConfirm === chatId) {
      onDeleteChat(chatId)
      setShowDeleteConfirm(null)
    } else {
      setShowDeleteConfirm(chatId)
    }
  }

  const handleExportChat = (chatId, e) => {
    e.stopPropagation()
    exportChatHistory(chatId)
  }

  return (
    <aside className="rounded-lg border border-[#1F2A24] bg-[#111C18] p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-white">Chat History</h3>
        {chatEntries.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
            title="Clear all chats"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-2 mb-4 max-h-[400px] overflow-y-auto">
        {chatEntries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No chat history yet.</p>
            <p className="text-xs mt-1">Start a conversation below!</p>
          </div>
        ) : (
          chatEntries.map(([chatId, chat]) => (
            <div
              key={chatId}
              className={`group rounded-md border px-3 py-2 cursor-pointer transition-colors relative ${
                chatId === currentChatId
                  ? "border-[#22C55E] bg-[#0E1613]" 
                  : "border-[#1F2A24] bg-[#0E1613] hover:bg-[#12201B]"
              }`}
              onClick={() => onLoadChat(chatId)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(chat.lastUpdated)}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {chat.messages.length} messages
                  </p>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleExportChat(chatId, e)}
                    className="text-xs text-blue-400 hover:text-blue-300 p-1"
                    title="Export chat"
                  >
                    ↓
                  </button>
                  <button
                    onClick={(e) => handleDeleteChat(chatId, e)}
                    className={`text-xs p-1 transition-colors ${
                      showDeleteConfirm === chatId 
                        ? "text-red-300 bg-red-900/20" 
                        : "text-red-400 hover:text-red-300"
                    }`}
                    title={showDeleteConfirm === chatId ? "Click again to confirm" : "Delete chat"}
                  >
                    {showDeleteConfirm === chatId ? "✓" : "×"}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Button
        onClick={onNewChat}
        variant="outline"
        className="w-full border-dashed border-[#1F2A24] bg-[#0E1613] text-gray-200 hover:bg-[#12201B] transition-colors"
      >
        + New Chat
      </Button>

      <div className="mt-4 pt-3 border-t border-[#1F2A24]">
        <p className="text-xs text-gray-500 text-center">
          Chats are saved locally in your browser
        </p>
      </div>
    </aside>
  )
}

export default EnhancedChatHistorySidebar
