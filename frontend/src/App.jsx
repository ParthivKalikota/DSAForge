import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ChatProvider } from './contexts/ChatContext';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import QuestionList from './components/QuestionList';
import AdminDashboard from './components/AdminDashboard';
import StudentFeedback from './components/StudentFeedback';
import DiscussionBoard from './components/DiscussionBoard';
import DiscussionList from './components/DiscussionList';
import './App.css';

// Redirect authenticated users away from auth pages
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <Navigate to="/" /> : children;
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.isAdmin ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ChatProvider>
          <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route 
                path="/login" 
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                } 
              />
              <Route 
                path="/register" 
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                } 
              />
              <Route
                path="/questions"
                element={
                  <PrivateRoute>
                    <QuestionList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/discussions"
                element={
                  <PrivateRoute>
                    <DiscussionList />
                  </PrivateRoute>
                }
              />
              <Route
                path="/discussions/:questionId"
                element={
                  <PrivateRoute>
                    <DiscussionBoard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
              <Route
                path="/feedback"
                element={
                  <PrivateRoute>
                    <StudentFeedback />
                  </PrivateRoute>
                }
              />
            </Routes>
          </div>
        </ChatProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
