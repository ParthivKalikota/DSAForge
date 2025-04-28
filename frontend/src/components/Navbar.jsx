import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { HomeIcon, AcademicCapIcon, UserGroupIcon, ChatBubbleLeftRightIcon, Bars3Icon, XMarkIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button*/}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold gradient-text">DSAForge</span>
            </div>
            <div className="hidden sm:block sm:ml-6">
              <div className="flex space-x-4">
                <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                  <HomeIcon className="h-5 w-5 mr-1" /> Home
                </Link>
                {user && (
                  <Link to="/questions" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                    <AcademicCapIcon className="h-5 w-5 mr-1" /> Questions
                  </Link>
                )}
                {user && (
                  <Link to="/discussions" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                    <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mr-1" /> Discussions
                  </Link>
                )}
                {user?.isAdmin && (
                  <Link to="/admin" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                    <UserGroupIcon className="h-5 w-5 mr-1" /> Admin
                  </Link>
                )}
                {user && !user.isAdmin && (
                  <Link to="/feedback" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-1" /> Feedback
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {user && (
              <span className="text-gray-700 mr-4 hidden sm:block">{user.name}</span>
            )}
            {user ? (
              <button 
                onClick={logout} 
                className="btn-primary"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-md rounded-b-lg">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <HomeIcon className="h-5 w-5 inline-block mr-1" /> Home
          </Link>
          {user && (
            <Link 
              to="/questions" 
              className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <AcademicCapIcon className="h-5 w-5 inline-block mr-1" /> Questions
            </Link>
          )}
          {user && (
            <Link 
              to="/discussions" 
              className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 inline-block mr-1" /> Discussions
            </Link>
          )}
          {user?.isAdmin && (
            <Link 
              to="/admin" 
              className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <UserGroupIcon className="h-5 w-5 inline-block mr-1" /> Admin
            </Link>
          )}
          {user && !user.isAdmin && (
            <Link 
              to="/feedback" 
              className="text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 inline-block mr-1" /> Feedback
            </Link>
          )}
          {user && (
            <div className="px-3 py-2 text-gray-700">
              <span className="block text-sm font-medium">Signed in as:</span>
              <span className="block mt-1 text-sm font-semibold">{user.name}</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
