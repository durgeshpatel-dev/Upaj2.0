import React, { useState, useEffect } from 'react'
import MessageBubble from './MessageBubble'
import InputBox from './InputBox'

const initialMessages = [
  { id: 1, role: "ai", text: "Hi there! How can I help you today?" },
  {
    id: 2,
    role: "user",
    text: "Hi, I'm having trouble understanding the yield prediction report. Can you explain the key metrics?",
  },
  {
    id: 3,
    role: "ai",
    text: "Of course! The yield prediction report provides an estimate based on weather, soil, and historical data. Key metrics include predicted yield (bushels/acre), confidence interval, and influencing factors like rainfall and temperature.",
  },
]

const ChatWindow = () => {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "ai") {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(lastMessage.text);
      synth.speak(utterance);
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      role: "user",
      text: input.trim()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        role: "ai",
        text: "Thank you for your question. I'm processing your request and will provide a detailed response shortly."
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="rounded-lg border border-[#1F2A24] bg-[#111C18] p-4 flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-auto pr-2">
        {messages.map((message) => (
          <MessageBubble key={message.id} {...message} />
        ))}
      </div>

      {/* Input */}
      <div className="mt-3">
        <InputBox
          value={input}
          onChange={setInput}
          onSend={sendMessage}
          placeholder="Type your message here..."
        />
      </div>
    </div>
  );
};

export default ChatWindow;
