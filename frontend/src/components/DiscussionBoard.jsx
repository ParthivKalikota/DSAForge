import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ChatBox from './ChatBox';

const DiscussionBoard = () => {
  const { questionId } = useParams();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestionDetails = async () => {
      if (!questionId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/questions/${questionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setQuestion(response.data);
      } catch (err) {
        console.error('Error fetching question details:', err);
        setError('Failed to load question details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestionDetails();
  }, [questionId, token]);

  const handleBackToQuestions = () => {
    navigate('/questions');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
          {error || 'Question not found'}
        </div>
        <button
          onClick={handleBackToQuestions}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Questions
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={handleBackToQuestions}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Questions
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{question.title}</h1>
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            question.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
            question.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {question.difficulty}
          </span>
          {question.tags && question.tags.map(tag => (
            <span key={tag} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-700 mb-4">{question.description}</p>
        {question.platform_url && (
          <a 
            href={question.platform_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            Solve on Platform
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="h-[600px]">
          <ChatBox questionId={questionId} questionTitle={question.title} />
        </div>
      </div>
    </div>
  );
};

export default DiscussionBoard;
