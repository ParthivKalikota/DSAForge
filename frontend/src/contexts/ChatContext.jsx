import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [chats, setChats] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user, token } = useAuth();

  // Configure axios with auth token
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to requests
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Fetch chat for a specific question
  const fetchQuestionChat = async (questionId) => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/api/chats/question/${questionId}`);
      
      setChats(prev => ({
        ...prev,
        [questionId]: response.data
      }));
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch chat');
      console.error('Error fetching chat:', err);
    } finally {
      setLoading(false);
    }
  };

  // Send a message in a chat
  const sendMessage = async (questionId, content) => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(`/api/chats/question/${questionId}/message`, { content });
      
      // Update the chat with the new message
      setChats(prev => {
        const currentChat = prev[questionId] || { messages: [] };
        return {
          ...prev,
          [questionId]: {
            ...currentChat,
            messages: [...currentChat.messages, response.data]
          }
        };
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user's recent chats
  const fetchUserChats = async () => {
    if (!user || !token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get('/api/chats/user');
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user chats');
      console.error('Error fetching user chats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Clear chat state on logout
  useEffect(() => {
    if (!user) {
      setChats({});
    }
  }, [user]);

  const value = {
    chats,
    loading,
    error,
    fetchQuestionChat,
    sendMessage,
    fetchUserChats
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
