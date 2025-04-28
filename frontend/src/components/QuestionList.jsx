import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import { 
  ChevronRightIcon, 
  AcademicCapIcon, 
  BookmarkIcon, 
  CheckCircleIcon, 
  MagnifyingGlassIcon,
  LinkIcon,
  CodeBracketIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleOvalLeftEllipsisIcon
} from '@heroicons/react/24/outline';
import { CheckIcon, ClockIcon, ArrowPathIcon } from '@heroicons/react/24/solid';

const QuestionList = ({ discussionMode = false }) => {
  const [questions, setQuestions] = useState([]);
  const [progress, setProgress] = useState({});
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchQuestions();
    if (user) {
      fetchProgress();
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch questions. Please try again later.');
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async () => {
    try {
      console.log('Fetching progress data...');
      const response = await axios.get('/api/progress');
      console.log('Progress data received:', response.data);
      
      const progressMap = {};
      response.data.forEach(item => {
        progressMap[item.question._id] = item;
      });
      
      console.log('Processed progress map:', progressMap);
      setProgress(progressMap);
      setError('');
      return progressMap; // Return the map for immediate use if needed
    } catch (err) {
      console.error('Error fetching progress:', err.response?.data || err.message || err);
      setError('Failed to fetch your progress. Please try again later.');
      return {}; // Return empty object in case of error
    }
  };

  const updateStatus = async (questionId, status) => {
    try {
      console.log(`Updating question ${questionId} status to ${status}...`);
      
      // Add a loading state for better user feedback
      setLoading(true);
      
      // Clear any previous errors
      setError('');
      
      const response = await axios.post('/api/progress/update-status', {
        questionId,
        status
      });
      
      console.log('Update status response:', response.data);
      
      // Immediately update the UI with the new status
      setProgress(prevProgress => {
        console.log('Previous progress state:', prevProgress);
        const newProgress = { ...prevProgress };
        newProgress[questionId] = response.data;
        console.log('New progress state:', newProgress);
        return newProgress;
      });
      
      // Force a re-fetch of progress data to ensure UI is in sync with backend
      await fetchProgress();
      
      console.log('Progress after re-fetch:', progress);
      
    } catch (err) {
      console.error('Error updating status:', err.response?.data || err.message || err);
      setError('Failed to update question status. Please try again.');
    } finally {
      // Always make sure to turn off loading state
      setLoading(false);
    }
  };

  const handleDiscussClick = (questionId) => {
    navigate(`/discussions/${questionId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Solved':
        return 'badge-success';
      case 'NeedsRevision':
        return 'badge-warning';
      default:
        return 'badge-secondary';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy':
        return 'badge-success';
      case 'Medium':
        return 'badge-warning';
      case 'Hard':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Solved':
        return <CheckIcon className="h-4 w-4 mr-1" />;
      case 'NeedsRevision':
        return <ClockIcon className="h-4 w-4 mr-1" />;
      default:
        return <ArrowPathIcon className="h-4 w-4 mr-1" />;
    }
  };

  const getPlatformIcon = (platformName) => {
    const name = platformName?.toLowerCase() || '';
    if (name.includes('leetcode')) {
      return <CodeBracketIcon className="h-5 w-5 mr-2" />;
    } else if (name.includes('hackerrank')) {
      return <CodeBracketIcon className="h-5 w-5 mr-2" />;
    } else if (name.includes('codeforces')) {
      return <CodeBracketIcon className="h-5 w-5 mr-2" />;
    } else {
      return <LinkIcon className="h-5 w-5 mr-2" />;
    }
  };

  const toggleDropdown = (questionId, event) => {
    // Stop event propagation to prevent immediate closing
    if (event) event.stopPropagation();
    setOpenDropdownId(openDropdownId === questionId ? null : questionId);
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    switch (filter) {
      case 'solved':
        return progress[question._id]?.status === 'Solved';
      case 'unsolved':
        return !progress[question._id] || progress[question._id]?.status === 'Unsolved';
      case 'revision':
        return progress[question._id]?.status === 'NeedsRevision';
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto p-4 max-w-6xl fade-in">
      <div className="card mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {discussionMode ? 'Discussion Forum' : 'DSA Practice Hub'}
        </h1>
        <p className="text-gray-600 mb-6">
          {discussionMode 
            ? 'Collaborate and discuss DSA problems with your peers' 
            : 'Master Data Structures and Algorithms one problem at a time'}
        </p>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search questions..."
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('solved')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${filter === 'solved' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border border-green-500 text-green-600 hover:bg-green-50'}`}
            >
              <CheckIcon className="h-4 w-4 mr-1" /> Solved
            </button>
            <button
              onClick={() => setFilter('unsolved')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${filter === 'unsolved' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'border border-purple-500 text-purple-600 hover:bg-purple-50'}`}
            >
              <ArrowPathIcon className="h-4 w-4 mr-1" /> Unsolved
            </button>
            <button
              onClick={() => setFilter('revision')}
              className={`px-4 py-2 rounded-lg flex items-center transition-all duration-200 ${filter === 'revision' ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : 'border border-yellow-500 text-yellow-600 hover:bg-yellow-50'}`}
            >
              <ClockIcon className="h-4 w-4 mr-1" /> Needs Revision
            </button>
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto">
            </div>
            <div className="text-gray-500 mt-4">Loading questions...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No questions found matching your criteria.</p>
              </div>
            ) : (
              filteredQuestions.map(question => (
                <div key={question._id} className="card p-4 hover:shadow-lg transition-shadow duration-200">
                  <div className="flex flex-col md:flex-row md:items-center">
                    <div className="flex-1">
                      <div className="flex items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800 mb-1">{question.title}</h3>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <span className={`badge ${getDifficultyColor(question.difficulty)}`}>
                              {question.difficulty}
                            </span>
                            {question.tags && question.tags.map(tag => (
                              <span key={tag} className="badge badge-info">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="question-actions">
                      {!discussionMode && progress[question._id] && (
                        <div className={`badge ${getStatusColor(progress[question._id].status)} flex items-center`}>
                          {getStatusIcon(progress[question._id].status)}
                          {progress[question._id].status}
                        </div>
                      )}
                      
                      {discussionMode ? (
                        <button
                          onClick={() => handleDiscussClick(question._id)}
                          className="btn-secondary flex items-center"
                        >
                          <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />
                          Join Discussion
                        </button>
                      ) : (
                        <>
                          {question.platform_url && (
                            <a
                              href={question.platform_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-outline flex items-center"
                            >
                              {getPlatformIcon(question.platform || 'external')}
                              Solve
                              <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                            </a>
                          )}
                          
                          <div className="dropdown" ref={dropdownRef}>
                            <button 
                              className="btn-primary flex items-center"
                              onClick={(e) => toggleDropdown(question._id, e)}
                            >
                              <BookmarkIcon className="h-5 w-5 mr-2" />
                              Track
                              <ChevronRightIcon className="h-4 w-4 ml-1" />
                            </button>
                            {openDropdownId === question._id && (
                              <div className="dropdown-content block" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log("Mark as Solved clicked for question:", question._id);
                                    await updateStatus(question._id, 'Solved');
                                    // Force re-render by updating a state
                                    setQuestions([...questions]);
                                    setOpenDropdownId(null);
                                  }}
                                  className="dropdown-item text-green-600 hover:bg-green-50 w-full"
                                >
                                  <CheckIcon className="h-4 w-4 mr-2" />
                                  Mark as Solved
                                </button>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log("Needs Revision clicked for question:", question._id);
                                    await updateStatus(question._id, 'NeedsRevision');
                                    // Force re-render by updating a state
                                    setQuestions([...questions]);
                                    setOpenDropdownId(null);
                                  }}
                                  className="dropdown-item text-yellow-600 hover:bg-yellow-50 w-full"
                                >
                                  <ClockIcon className="h-4 w-4 mr-2" />
                                  Needs Revision
                                </button>
                                <button
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    console.log("Mark as Unsolved clicked for question:", question._id);
                                    await updateStatus(question._id, 'Unsolved');
                                    // Force re-render by updating a state
                                    setQuestions([...questions]);
                                    setOpenDropdownId(null);
                                  }}
                                  className="dropdown-item text-purple-600 hover:bg-purple-50 w-full"
                                >
                                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                                  Mark as Unsolved
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <button
                            onClick={() => handleDiscussClick(question._id)}
                            className="btn-outline flex items-center"
                          >
                            <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-2" />
                            Discuss
                          </button>
                        </>
                      )}
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

export default QuestionList;
