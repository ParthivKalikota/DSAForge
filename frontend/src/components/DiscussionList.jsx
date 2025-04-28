import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  MagnifyingGlassIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UserGroupIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const DiscussionList = () => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const fetchDiscussions = async () => {
    try {
      setLoading(true);
      // Fetch all questions with their associated chat data
      const response = await axios.get('/api/chats/active-discussions');
      setDiscussions(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch discussions. Please try again later.');
      console.error('Error fetching discussions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinDiscussion = (questionId) => {
    navigate(`/discussions/${questionId}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredDiscussions = discussions.filter(discussion => 
    discussion.question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    discussion.question.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 max-w-6xl fade-in">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">Discussion Forum</h1>
        <p className="text-gray-600 mb-6">
          Collaborate and discuss DSA problems with your peers
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search discussions..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <div className="text-gray-500 mt-4">Loading discussions...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No discussions found matching your criteria.</p>
                <p className="text-gray-500 mt-2">Start a new discussion by visiting the Questions page.</p>
              </div>
            ) : (
              filteredDiscussions.map(discussion => (
                <div key={discussion._id} className="card p-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{discussion.question.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`badge ${
                              discussion.question.difficulty === 'Easy' ? 'badge-success' :
                              discussion.question.difficulty === 'Medium' ? 'badge-warning' :
                              'badge-danger'
                            }`}>
                              {discussion.question.difficulty}
                            </span>
                            {discussion.question.tags && discussion.question.tags.map(tag => (
                              <span key={tag} className="badge badge-info">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-500 mb-2">
                            <UserGroupIcon className="h-4 w-4 mr-1" />
                            <span>{discussion.participants.length} participants</span>
                            <span className="mx-2">•</span>
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>Last active: {formatDate(discussion.updatedAt)}</span>
                          </div>
                          
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {discussion.question.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="question-actions">
                      <button
                        onClick={() => handleJoinDiscussion(discussion.question._id)}
                        className="btn-secondary flex items-center"
                      >
                        <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />
                        Join Discussion
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionList;
