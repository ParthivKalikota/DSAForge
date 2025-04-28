import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  AcademicCapIcon,
  ChartBarIcon,
  ClockIcon,
  CodeBracketIcon,
  UserGroupIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Curated DSA Problems',
    description: 'Carefully selected problems to build your algorithmic thinking',
    icon: CodeBracketIcon,
  },
  {
    name: 'Progress Tracking',
    description: 'Track your progress and identify areas for improvement',
    icon: ChartBarIcon,
  },
  {
    name: 'Structured Learning',
    description: 'Follow a structured path from basic to advanced concepts',
    icon: AcademicCapIcon,
  },
  {
    name: 'Community Learning',
    description: 'Learn alongside peers and share your knowledge',
    icon: UserGroupIcon,
  },
  {
    name: 'Time Management',
    description: 'Set goals and manage your practice schedule effectively',
    icon: ClockIcon,
  },
  {
    name: 'Achievement System',
    description: 'Earn badges and track your milestones',
    icon: CheckCircleIcon,
  },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span className="block">Master Data Structures</span>
                  <span className="block gradient-text mt-3">and Algorithms</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl">
                  Join DSAForge and embark on your journey to become a better programmer. Practice curated problems, track your progress, and achieve your coding goals.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center">
                  {user ? (
                    <Link
                      to="/questions"
                      className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white button-gradient hover:opacity-90 md:text-lg md:px-10"
                    >
                      Start Practicing
                    </Link>
                  ) : (
                    <>
                      <Link
                        to="/register"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white button-gradient hover:opacity-90 md:text-lg md:px-10"
                      >
                        Get Started
                      </Link>
                      <Link
                        to="/login"
                        className="mt-3 w-full sm:mt-0 sm:ml-3 sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:text-lg md:px-10"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold gradient-text sm:text-4xl">
              Why Choose DSAForge?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Everything you need to excel in your DSA journey
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6 hover-lift">
                  <div className="flow-root bg-white rounded-lg shadow-sm px-6 pb-8 border border-gray-100">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to start your DSA journey?</span>
            <span className="block">Join DSAForge today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Practice problems, track progress, and achieve your coding goals with our structured learning platform.
          </p>
          {!user && (
            <Link
              to="/register"
              className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 sm:w-auto"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
