import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, AcademicCapIcon, CheckIcon, ClockIcon, ChartBarIcon, StarIcon } from '@heroicons/react/24/outline';

const StudentProgress = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentProgress, setStudentProgress] = useState(null);
  const [overallStats, setOverallStats] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [feedbackContent, setFeedbackContent] = useState('');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user?.isAdmin) {
      fetchStudents();
      fetchOverallStats();
    }
  }, [user]);

  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/admin/students');
      setStudents(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch students data');
      console.error('Error fetching students:', error);
    }
  };

  const fetchOverallStats = async () => {
    try {
      const response = await axios.get('/api/admin/stats');
      setOverallStats(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch overall statistics');
      console.error('Error fetching stats:', error);
    }
  };

  const fetchStudentProgress = async (studentId) => {
    try {
      const response = await axios.get(`/api/admin/students/${studentId}/progress`);
      setStudentProgress(response.data);
      setSelectedStudent(studentId);
      fetchFeedback(studentId);
      setError('');
    } catch (error) {
      setError('Failed to fetch student progress');
      console.error('Error fetching student progress:', error);
    }
  };

  const fetchFeedback = async (studentId) => {
    try {
      const response = await axios.get(`/api/feedback/student/${studentId}`);
      setFeedback(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch feedback');
      console.error('Error fetching feedback:', error);
    }
  };

  const handleFeedbackSubmit = async () => {
    try {
      await axios.post('/api/feedback', {
        studentId: selectedStudent,
        content: feedbackContent,
        rating: feedbackRating
      });
      fetchFeedback(selectedStudent);
      setFeedbackContent('');
      setFeedbackRating(5);
      setError('');
    } catch (error) {
      setError('Failed to submit feedback');
      console.error('Error submitting feedback:', error);
    }
  };

  if (!user?.isAdmin) {
    return <div className="text-center p-4 text-gray-600">Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-4 fade-in">
      <h2 className="text-3xl font-bold gradient-text mb-6">Student Progress Overview</h2>

      {error && (
        <div className="bg-danger-50 border-l-4 border-danger-400 p-4 mb-6 rounded">
          <p className="text-sm text-danger-700">{error}</p>
        </div>
      )}

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {overallStats.map((stat) => (
          <div key={stat.student._id} className="card card-hover">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                <UserIcon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{stat.student.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{stat.student.email}</p>
                
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="p-3 rounded-lg bg-success-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Solved</p>
                      <p className="font-bold text-success-600 text-lg">{stat.stats.solvedQuestions}</p>
                    </div>
                    <CheckIcon className="w-5 h-5 text-success-500" />
                  </div>
                  <div className="p-3 rounded-lg bg-warning-50 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Needs Revision</p>
                      <p className="font-bold text-warning-600 text-lg">{stat.stats.needsRevision}</p>
                    </div>
                    <ClockIcon className="w-5 h-5 text-warning-500" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <p className="text-xs text-gray-500">Completion Rate</p>
                    <p className="text-xs font-medium text-primary-600">{stat.stats.completionRate}%</p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full progress-bar-animation"
                      style={{ width: `${stat.stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
                
                <button
                  onClick={() => fetchStudentProgress(stat.student._id)}
                  className="mt-4 w-full button-primary flex items-center justify-center"
                >
                  <ChartBarIcon className="w-5 h-5 mr-2" />
                  View Detailed Progress
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Student Progress */}
      {studentProgress && (
        <div className="card mt-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-full bg-primary-100 text-primary-600">
              <UserIcon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800">
              {studentProgress.student.name}'s Progress
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card bg-primary-50 border border-primary-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Questions</p>
                  <p className="text-3xl font-bold text-primary-700 mt-1">
                    {studentProgress.stats.totalQuestions}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                  <AcademicCapIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="card bg-success-50 border border-success-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solved</p>
                  <p className="text-3xl font-bold text-success-700 mt-1">
                    {studentProgress.stats.solvedQuestions}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-success-100 text-success-600">
                  <CheckIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
            
            <div className="card bg-warning-50 border border-warning-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Needs Revision</p>
                  <p className="text-3xl font-bold text-warning-700 mt-1">
                    {studentProgress.stats.needsRevision}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-warning-100 text-warning-600">
                  <ClockIcon className="w-6 h-6" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">Question History</h4>
            <div className="space-y-4">
              {studentProgress.progress.map((item) => (
                <div key={item._id} className="card border border-gray-100 hover:border-primary-200 transition-colors duration-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-gray-800">{item.question.title}</h5>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.question.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <span className={`badge ${item.status === 'Solved' ? 'badge-success' : 
                          item.status === 'NeedsRevision' ? 'badge-warning' : 'badge-secondary'} 
                          flex items-center`}>
                          {item.status === 'Solved' ? <CheckIcon className="h-4 w-4 mr-1" /> : 
                           item.status === 'NeedsRevision' ? <ClockIcon className="h-4 w-4 mr-1" /> : null}
                          {item.status}
                        </span>
                        <span className={`badge ${item.question.difficulty === 'Easy' ? 'badge-success' : 
                          item.question.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'}`}>
                          {item.question.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex flex-col items-end">
                      <span className="font-medium">Last attempted:</span>
                      <span>{new Date(item.lastAttempted).toLocaleDateString()}</span>
                    </div>
                  </div>
                  {item.notes && (
                    <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded border-l-4 border-primary-300">
                      <span className="font-medium">Notes:</span> {item.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Section */}
          <div className="mt-8">
            <h4 className="text-xl font-semibold mb-4">Feedback</h4>
            <div className="space-y-4">
              {feedback.map((fb) => (
                <div key={fb._id} className="card border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <h5 className="font-semibold text-gray-800">Feedback by {fb.givenBy.name}</h5>
                      <p className="text-sm text-gray-600 mt-2">
                        {fb.content}
                      </p>
                      <div className="flex items-center gap-1 mt-3">
                        <span className="text-sm text-gray-600">Rating:</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon 
                              key={i} 
                              className={`h-5 w-5 ${i < fb.rating ? 'text-warning-500 fill-warning-500' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(fb.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feedback Form */}
            <div className="mt-6 card border border-gray-200">
              <h4 className="font-semibold mb-3">Provide Feedback</h4>
              <textarea
                className="input-field mb-4"
                rows="3"
                placeholder="Enter feedback..."
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
              />
              <div className="flex items-center mb-4">
                <label className="mr-2 text-gray-700">Rating:</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => setFeedbackRating(rating)}
                      className="focus:outline-none"
                    >
                      <StarIcon 
                        className={`h-6 w-6 ${rating <= feedbackRating ? 'text-warning-500 fill-warning-500' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleFeedbackSubmit}
                className="button-primary"
                disabled={!feedbackContent.trim()}
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProgress;
