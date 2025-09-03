import React, { useState, useEffect } from 'react'
import Button from '../Button'
import { formatTimestamp, exportChatHistory } from '../../utils/chatUtils'
import { chatbotAPI } from '../../utils/api'

const EnhancedChatHistorySidebar = ({ 
  chatHistory = {}, 
  currentChatId, 
  onNewChat, 
  onLoadChat, 
  onDeleteChat, 
  onClearAll 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [backendHistory, setBackendHistory] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Prefer backend-fetched history when available, otherwise use prop
  const effectiveHistory = backendHistory && Object.keys(backendHistory).length > 0 ? backendHistory : chatHistory || {}

  const chatEntries = Object.entries(effectiveHistory)
    .sort(([, a], [, b]) => (b.lastUpdated || 0) - (a.lastUpdated || 0))
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

  // Fetch chat history from backend when component mounts
  useEffect(() => {
    let mounted = true
    const fetchHistory = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await chatbotAPI.getChatHistory()
        if (!mounted) return
        if (resp.success && resp.data && Array.isArray(resp.data.chats)) {
          const mapped = {}
          resp.data.chats.forEach(chat => {
            const id = chat.id || chat._id || String(chat.sessionId || chat.session || Math.random())
            mapped[id] = {
              messages: chat.messages || chat.messagesList || [],
              created: chat.createdAt ? new Date(chat.createdAt).getTime() : (chat.created ? chat.created : Date.now()),
              lastUpdated: chat.updatedAt ? new Date(chat.updatedAt).getTime() : (chat.lastUpdated ? chat.lastUpdated : Date.now()),
              title: chat.title || (chat.messages && chat.messages.length ? chat.messages[0].text || chat.messages[0].content || 'Chat' : 'Chat')
            }
          })
          setBackendHistory(mapped)
        } else if (resp.success && resp.data && typeof resp.data === 'object') {
          // Accept backend that returns object with keys
          // Try to normalize if possible
          const maybeChats = resp.data.chats || resp.data.history || resp.data
          if (Array.isArray(maybeChats)) {
            const mapped = {}
            maybeChats.forEach(chat => {
              const id = chat.id || chat._id || String(chat.sessionId || chat.session || Math.random())
              mapped[id] = {
                messages: chat.messages || [],
                created: chat.createdAt ? new Date(chat.createdAt).getTime() : Date.now(),
                lastUpdated: chat.updatedAt ? new Date(chat.updatedAt).getTime() : Date.now(),
                title: chat.title || 'Chat'
              }
            })
            setBackendHistory(mapped)
          }
        }
      } catch (err) {
        console.error('Failed to fetch chat history in sidebar:', err)
        setError(err?.message || 'Failed to load chat history')
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchHistory()

    return () => { mounted = false }
  }, [])

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
