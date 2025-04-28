import React, { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useAuth } from '../contexts/AuthContext';

const StudentFeedback = () => {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const fetchFeedback = async () => {
    try {
      const response = await axios.get(`/api/feedback/student/${user._id}`);
      setFeedback(response.data);
      setError('');
    } catch (error) {
      setError('Failed to fetch feedback');
      console.error('Error fetching feedback:', error);
    }
  };

  if (!user) {
    return <div className="text-center p-4">Access Denied</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Your Feedback</h2>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        {feedback.map((fb) => (
          <div key={fb._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h5 className="font-semibold">Feedback by {fb.givenBy.name}</h5>
                <p className="text-sm text-gray-600 mt-1">
                  {fb.content}
                </p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 rounded text-sm bg-blue-100 text-blue-800`}>
                    Rating: {fb.rating}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                {new Date(fb.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentFeedback;
