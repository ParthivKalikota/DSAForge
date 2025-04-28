import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../contexts/ChatContext';
import { useAuth } from '../contexts/AuthContext';

const ChatBox = ({ questionId, questionTitle }) => {
  const [message, setMessage] = useState('');
  const { chats, loading, error, fetchQuestionChat, sendMessage } = useChat();
  const { user } = useAuth();
  const messagesEndRef = useRef(null);
  const currentChat = chats[questionId] || { messages: [] };

  // Fetch chat when component mounts
  useEffect(() => {
    if (questionId) {
      fetchQuestionChat(questionId);
    }
  }, [questionId, fetchQuestionChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentChat.messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    await sendMessage(questionId, message);
    setMessage('');
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md">
      {/* Chat header */}
      <div className="px-4 py-3 bg-blue-600 text-white rounded-t-lg">
        <h3 className="font-semibold text-lg">
          Discussion: {questionTitle || `Problem #${questionId}`}
        </h3>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 p-4 overflow-y-auto">
        {loading && currentChat.messages.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : currentChat.messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            <p>No messages yet. Start the discussion!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentChat.messages.map((msg, index) => {
              const isSender = msg.sender._id === user?._id;
              return (
                <div 
                  key={index} 
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[75%] px-4 py-2 rounded-lg ${
                      isSender 
                        ? 'bg-blue-500 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                    }`}
                  >
                    {!isSender && (
                      <div className="font-semibold text-xs mb-1">
                        {msg.sender.name}
                      </div>
                    )}
                    <p>{msg.content}</p>
                    <div className={`text-xs mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
                      {formatTime(msg.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mt-2">
            {error}
          </div>
        )}
      </div>
      
      {/* Message input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
            disabled={loading || !message.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatBox;
