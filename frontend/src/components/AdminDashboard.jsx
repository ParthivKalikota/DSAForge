import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import QuestionForm from './QuestionForm';
import StudentProgress from './StudentProgress';
import {
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('questions');

  useEffect(() => {
    if (activeTab === 'questions') {
      fetchQuestions();
    }
  }, [activeTab]);

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/api/questions');
      setQuestions(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch questions');
      console.error('Error fetching questions:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (selectedQuestion) {
        await axios.put(`/api/questions/${selectedQuestion._id}`, formData);
      } else {
        await axios.post('/api/questions', formData);
      }
      fetchQuestions();
      setShowForm(false);
      setSelectedQuestion(null);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question');
    }
  };

  const handleEdit = (question) => {
    setSelectedQuestion(question);
    setShowForm(true);
  };

  const handleDelete = async (questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      await axios.delete(`/api/questions/${questionId}`);
      fetchQuestions();
      setError('');
    } catch (err) {
      setError('Failed to delete question');
      console.error('Error deleting question:', err);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold gradient-text mb-6">Admin Dashboard</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('questions')}
              className={`${
                activeTab === 'questions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Question Management
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`${
                activeTab === 'progress'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <UserGroupIcon className="h-5 w-5 mr-2" />
              Student Progress
            </button>
          </nav>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'questions' ? (
          <>
            {/* Question Management Section */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => {
                  setSelectedQuestion(null);
                  setShowForm(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Add New Question
              </button>
            </div>

            {showForm ? (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selectedQuestion ? 'Edit Question' : 'Add New Question'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setSelectedQuestion(null);
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircleIcon className="h-6 w-6" />
                  </button>
                </div>
                <QuestionForm
                  question={selectedQuestion}
                  onSubmit={handleSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setSelectedQuestion(null);
                  }}
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Difficulty
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {questions.map((question) => (
                        <tr key={question._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {question.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                question.difficulty === 'Easy'
                                  ? 'bg-green-100 text-green-800'
                                  : question.difficulty === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {question.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{question.category}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleEdit(question)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(question._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        ) : (
          <StudentProgress />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
