import React from 'react'
import { formatTimestamp } from '../../utils/chatUtils'

// Small, safe markdown -> HTML renderer (no external deps)
const escapeHtml = (str) => {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const escapeAttr = (s) => {
  return String(s).replace(/"/g, '%22').replace(/'/g, '%27')
}

const renderMarkdownToHtml = (md) => {
  if (!md && md !== 0) return ''
  let text = String(md)

  // Escape HTML first
  let escaped = escapeHtml(text)

  // Extract fenced code blocks and replace with placeholders
  const codeBlocks = []
  escaped = escaped.replace(/```([\s\S]*?)```/g, (m, p1) => {
    const idx = codeBlocks.length
    codeBlocks.push(`<pre class="rounded bg-[#0b0b0b] p-3 overflow-auto"><code>${escapeHtml(p1)}</code></pre>`)
    return `@@CODE_BLOCK_${idx}@@`
  })

  // Process lines for headings and lists
  const lines = escaped.split('\n')
  const out = []
  let inUl = false
  let inOl = false

  const flushList = () => {
    if (inUl) { out.push('</ul>'); inUl = false }
    if (inOl) { out.push('</ol>'); inOl = false }
  }

  for (let rawLine of lines) {
    const line = rawLine.trim()
    if (/^#{3}\s+/.test(line)) {
      flushList()
      out.push('<h3 class="text-sm font-semibold">' + line.replace(/^#{3}\s+/, '') + '</h3>')
      continue
    }
    if (/^#{2}\s+/.test(line)) {
      flushList()
      out.push('<h2 class="text-base font-semibold">' + line.replace(/^#{2}\s+/, '') + '</h2>')
      continue
    }
    if (/^#\s+/.test(line)) {
      flushList()
      out.push('<h1 class="text-lg font-bold">' + line.replace(/^#\s+/, '') + '</h1>')
      continue
    }

    // Unordered list
    const ulMatch = line.match(/^[-*]\s+(.*)/)
    if (ulMatch) {
      if (!inUl) { flushList(); out.push('<ul class="list-disc list-inside space-y-1">'); inUl = true }
      out.push('<li>' + ulMatch[1] + '</li>')
      continue
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s+(.*)/)
    if (olMatch) {
      if (!inOl) { flushList(); out.push('<ol class="list-decimal list-inside space-y-1">'); inOl = true }
      out.push('<li>' + olMatch[1] + '</li>')
      continue
    }

    if (line === '') {
      flushList()
      out.push('<br/>')
      continue
    }

    // Paragraph line
    flushList()
    out.push('<p>' + line + '</p>')
  }

  flushList()

  let html = out.join('\n')

  // Inline code
  html = html.replace(/`([^`]+)`/g, (m, p1) => `<code class="bg-black/20 px-1 rounded">${escapeHtml(p1)}</code>`)

  // Bold **text** or __text__
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>')

  // Italic *text* or _text_
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')
  html = html.replace(/_(.+?)_/g, '<em>$1</em>')

  // Links [text](url)
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (m, textPart, urlPart) => {
    const safeUrl = escapeAttr(urlPart)
    return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${textPart}</a>`
  })

  // Restore code blocks
  html = html.replace(/@@CODE_BLOCK_(\d+)@@/g, (m, idx) => codeBlocks[Number(idx)] || '')

  return html
}

const MessageBubble = ({ role, text, timestamp }) => {
  const isAI = role === "ai"

  // Ensure text is a string to avoid React object child errors
  let displayText = ''
  try {
    if (typeof text === 'string') displayText = text
    else if (text === null || text === undefined) displayText = ''
    else displayText = typeof text === 'object' ? JSON.stringify(text, null, 2) : String(text)
  } catch (err) {
    displayText = String(text)
  }

  // For AI messages, render lightweight markdown -> sanitized HTML
  const renderedHtml = isAI ? renderMarkdownToHtml(displayText) : null

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
          {isAI ? (
            <div className="prose prose-invert max-w-none break-words" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
          ) : (
            <p className="whitespace-pre-wrap">{displayText}</p>
          )}
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
